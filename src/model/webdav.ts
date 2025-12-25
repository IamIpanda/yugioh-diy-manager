import { createClient, FileStat, WebDAVClient, WebDAVClientOptions } from 'webdav'
import { defineDriver } from 'localforage'

type WebDavOptions = LocalForageOptions & {
    url: string
    options?: WebDAVClientOptions
}

class WebDavClientWrapper {
    client: WebDAVClient
    
    constructor(options: LocalForageOptions) {
        let webdav_options = options as WebDavOptions
        this.client = createClient(webdav_options.url, webdav_options.options)
    }
    getItem<T>(key: string, _callback?: (err: any, value: T | null) => void): Promise<T | null> {
        if (key.startsWith("/")) 
            key = "/" + key
        let format: 'text' | 'binary' = 'text'
        if (key.endsWith(".jpg"))
            format = 'binary'
        else if (key.endsWith("@binary")) {
            key = key.substring(0, key.length - "@binary".length)
            format = 'binary'
        }
        return this.client.getFileContents(key, {format: format}).then((r) => r as T, (_) => null)
    }
    setItem<T>(key: string, value: T, _callback?: (err: any, value: T) => void): Promise<T> {
        if (key.startsWith("/"))
            key = "/" + key
        return this.client.putFileContents(key, value as string).then(() => value)
    }
    removeItem(key: string, _callback?: (err: any) => void): Promise<void> {
        if (key.startsWith("/"))
            key = "/" + key
        return this.client.deleteFile(key)
    }
    async clear(_callback?: (err: any) => void): Promise<void> {
        for (let filename of await this.keys())
            this.removeItem(filename)
    }
    key(_keyIndex: number, _callback?: (err: any, key: string) => void): Promise<string> {
        throw new Error('Function note implemented.')
    }
    async keys(path?: string, max_layer?: number, _callback?: (err: any, keys: string[]) => void): Promise<string[]> {
        let keys = []
        max_layer = max_layer ?? 999999
        let contents = await this.client.getDirectoryContents(path ?? "/") as FileStat[]
        for (let item of contents) {
            if (item.basename.startsWith("."))
                continue
            else if (item.type == 'file')
                keys.push(item.filename)
            else if (max_layer > 0)
                keys.push(...await this.keys(item.filename, max_layer-1))
        }
        return keys.map((key) => key.startsWith("/") ? key.substring(1) : key)
    }
    async iterate<T, U>(_iteratee: (value: T, key: string, iterationNumber: number) => U, _callback?: (err: any, result: U) => void): Promise<U> {
        throw new Error('Function note implemented.')
    }
}

const webdav: LocalForageDriver & { client: WebDavClientWrapper } = {
    _driver: 'webdav',
    client: null as unknown as WebDavClientWrapper,
    _initStorage: function (options: LocalForageOptions): void {
        this.client = new WebDavClientWrapper(options)
    },
    getItem: function <T>(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null> {
        return this.client.getItem(key, callback)
    },
    setItem: function <T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T> {
        return this.client.setItem(key, value, callback)
    },
    removeItem: function (key: string, callback?: (err: any) => void): Promise<void> {
        return this.client.removeItem(key, callback)
    },
    clear: function (callback?: (err: any) => void): Promise<void> {
        return this.client.clear(callback)
    },
    length: function (_callback?: (err: any, numberOfKeys: number) => void): Promise<number> {
        return this.keys().then((k) => k.length)
    },
    key: function (keyIndex: number, callback?: (err: any, key: string) => void): Promise<string> {
        return this.client.key(keyIndex, callback)
    },
    keys: function (callback?: (err: any, keys: string[]) => void): Promise<string[]> {
        return this.client.keys("/", 1, callback)
    },
    iterate: function <T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U, callback?: (err: any, result: U) => void): Promise<U> {
        return this.client.iterate(iteratee, callback)
    }
}

defineDriver(webdav)
