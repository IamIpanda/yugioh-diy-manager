import { defineDriver } from 'localforage'

class FSAClientWrapper {
    private directoryHandle: FileSystemDirectoryHandle

    constructor(directoryHandle: FileSystemDirectoryHandle) {
        this.directoryHandle = directoryHandle
    }

    private async resolveFile(key: string, create: boolean): Promise<FileSystemFileHandle> {
        const parts = key.split('/')
        let dir = this.directoryHandle
        for (let index = 0; index < parts.length - 1; index++) {
            if (parts[index].length > 0)
                dir = await dir.getDirectoryHandle(parts[index], { create: true })
        }
        return await dir.getFileHandle(parts[parts.length - 1], { create })
    }

    private stripBinarySuffix(key: string): string {
        if (key.endsWith('@binary'))
            return key.substring(0, key.length - '@binary'.length)
        return key
    }

    async getItem<T>(key: string, _callback?: (error: any, value: T | null) => void): Promise<T | null> {
        try {
            const actualKey = this.stripBinarySuffix(key)
            const fileHandle = await this.resolveFile(actualKey, false)
            const file = await fileHandle.getFile()
            if (key.endsWith('.jpg') || key.endsWith('@binary'))
                return await file.arrayBuffer() as unknown as T
            return await file.text() as unknown as T
        } catch {
            return null
        }
    }

    async setItem<T>(key: string, value: T, _callback?: (error: any, value: T) => void): Promise<T> {
        const actualKey = this.stripBinarySuffix(key)
        const fileHandle = await this.resolveFile(actualKey, true)
        const writable = await fileHandle.createWritable()
        try {
            if (value instanceof ArrayBuffer)
                await writable.write(value)
            else
                await writable.write(String(value))
        } finally {
            await writable.close()
        }
        return value
    }

    async removeItem(key: string, _callback?: (error: any) => void): Promise<void> {
        const parts = key.split('/')
        let dir = this.directoryHandle
        for (let index = 0; index < parts.length - 1; index++) {
            if (parts[index].length > 0)
                dir = await dir.getDirectoryHandle(parts[index], { create: false })
        }
        await dir.removeEntry(parts[parts.length - 1])
    }

    async clear(_callback?: (error: any) => void): Promise<void> {
        for await (const [name] of this.directoryHandle.entries())
            await this.directoryHandle.removeEntry(name, { recursive: true })
    }

    key(_keyIndex: number, _callback?: (error: any, key: string) => void): Promise<string> {
        throw new Error('Function not implemented.')
    }

    async keys(_path?: string, maxLayer?: number, _callback?: (error: any, keys: string[]) => void): Promise<string[]> {
        const keys: string[] = []
        await this.collectKeys(this.directoryHandle, '', keys, maxLayer ?? 1)
        return keys.filter(k => k !== '.history').sort()
    }

    private async collectKeys(dir: FileSystemDirectoryHandle, prefix: string, keys: string[], maxLayer: number): Promise<void> {
        if (maxLayer < 0) return
        for await (const [name, handle] of dir.entries()) {
            if (name.startsWith('.') && name !== '.history') continue
            const fullPath = prefix ? `${prefix}/${name}` : name
            if (handle.kind === 'file')
                keys.push(fullPath)
            else if (handle.kind === 'directory' && maxLayer > 0)
                await this.collectKeys(handle as FileSystemDirectoryHandle, fullPath, keys, maxLayer - 1)
        }
    }

    async iterate<T, U>(_iteratee: (value: T, key: string, iterationNumber: number) => U, _callback?: (error: any, result: U) => void): Promise<U> {
        throw new Error('Function not implemented.')
    }
}

const fsaDriver: LocalForageDriver & { client: FSAClientWrapper } = {
    _driver: 'fsa',
    _support: typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function',
    client: null as unknown as FSAClientWrapper,
    _initStorage: function (options: LocalForageOptions): void {
        this.client = new FSAClientWrapper((options as any).directoryHandle)
    },
    getItem: function <T>(key: string, callback?: (error: any, value: T | null) => void): Promise<T | null> {
        return this.client.getItem(key, callback)
    },
    setItem: function <T>(key: string, value: T, callback?: (error: any, value: T) => void): Promise<T> {
        return this.client.setItem(key, value, callback)
    },
    removeItem: function (key: string, callback?: (error: any) => void): Promise<void> {
        return this.client.removeItem(key, callback)
    },
    clear: function (callback?: (error: any) => void): Promise<void> {
        return this.client.clear(callback)
    },
    length: function (_callback?: (error: any, numberOfKeys: number) => void): Promise<number> {
        return this.keys().then(k => k.length)
    },
    key: function (keyIndex: number, callback?: (error: any, key: string) => void): Promise<string> {
        return this.client.key(keyIndex, callback)
    },
    keys: function (callback?: (error: any, keys: string[]) => void): Promise<string[]> {
        return this.client.keys('/', 1, callback)
    },
    iterate: function <T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U, callback?: (error: any, result: U) => void): Promise<U> {
        return this.client.iterate(iteratee, callback)
    },
}

defineDriver(fsaDriver)
