import localforage from "localforage";
import { format } from "cdb-transformer";
import { BlobReader, BlobWriter, Entry, TextReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js"

import { DEFAULT_PACKAGE_NAME, default_values, mydiy_values } from "./default"
import { generate_from_text, read_from_array_buffer } from "./card";
import "./webdav"

const MAGIC_VERSION_FIELD_NAME = "data_version"
const CURRENT_DATA_VERSION = 1;
const CURRENT_PACKAGE_VERSION = 1;

export let current_storage: LocalForage;
export let current_package: Package;

type PackageConfig = LocalForageOptions
type PackageVariable = {
    last_text_filename?: string
    data_version?: number
}
type Package = {
    config?: PackageConfig,
    variable: PackageVariable
}

export async function init_storage() {
    localforage.config({ name: 'ygopro-diy-mnager' })
    // Run migrations
    await migrate_data()

    // Init config values
    for (let key in default_values)
        if (await localforage.getItem(key) == null)
            await localforage.setItem(key, (default_values as any)[key])
        
    // Init current config values
    let last_pacakge_name: string = await localforage.getItem('last_package') ?? DEFAULT_PACKAGE_NAME
    await set_package(last_pacakge_name)

    // If this package already gone by some reason, reset to default.
    if (current_storage == null) {
        console.error(`Seems storage ${last_pacakge_name} already gone.`)
        localforage.dropInstance({ name: last_pacakge_name }) 
        current_storage = localforage.createInstance({ name: DEFAULT_PACKAGE_NAME })
        localforage.setItem('last_package', DEFAULT_PACKAGE_NAME)
    }
    if (last_pacakge_name == DEFAULT_PACKAGE_NAME)
        await load_default_package()
}

async function migrate_data() {
    let current_version: number = (await localforage.getItem(MAGIC_VERSION_FIELD_NAME)) ?? 0
    for (let version = current_version; version < CURRENT_DATA_VERSION; version++) {
        try {
            switch (version) {
            case 0:
                // 2025-10-18：Migrate packages from string[] to record<string, PackageConfig>
                let packages = await localforage.getItem('packages')
                if (Array.isArray(packages)) {
                    let new_packages = Object.fromEntries(packages.map((package_name) => [package_name, {}]))
                    await localforage.setItem('packages', new_packages)
                }
                break
            }
        }
        catch(e) {
            console.error(e)
            alert(`从版本${version}迁移数据失败。页面可能工作不正常或丢失数据。`)
            return
        }
        console.log(`从版本${version}迁移了数据。`)
    }
    await localforage.setItem(MAGIC_VERSION_FIELD_NAME, CURRENT_DATA_VERSION)
}

async function migrate_package() {
    let current_version = current_package.variable?.data_version ?? 0
    for (let version = current_version ?? 0; version < CURRENT_PACKAGE_VERSION; version++) {
        try {
            switch(version) {
            case 0:
                // 2025-10-18: Change file name from '.cdb' to '.txt'
                if (current_storage.config().driver == null) {
                    let keys = await current_storage.keys()
                    for (let key in keys.filter(key => key.endsWith('.cdb'))) {
                        let data = await current_storage.getItem(key)
                        await Promise.all([
                            current_storage.removeItem(key),
                            current_storage.setItem(key.substring(0, key.length - 4) + '.txt', data)
                        ])
                    }
                }
                break
            }
        }
        catch(e) {
            console.error(e)
            alert(`从版本${version}迁移数据失败。页面可能工作不正常或丢失数据。`)
            return
        }
        console.log(`从版本${version}迁移了数据${current_storage.config().name}。`)
    }
    if (current_package.variable == null) 
        current_package.variable = {}
    current_package.variable.data_version = CURRENT_PACKAGE_VERSION
    await save_package_variable()
}

export async function load_default_package() {
    for (let key in mydiy_values)
        if (await current_storage.getItem(key) == null)
            await current_storage.setItem(key, (mydiy_values as any)[key])
}

export async function package_list(): Promise<Record<string, Package>> {
    return (await localforage.getItem('packages')) ?? default_values.packages
}

export async function set_package(name: string, config?: PackageConfig) {
    let packages: Record<string, Package> = await localforage.getItem("packages") ?? {};
    if (packages[name] == null) {
        current_package = { config, variable: { data_version: CURRENT_PACKAGE_VERSION } }
        await localforage.setItem("packages", {...packages, [name]: current_package })
    }
    else
        current_package = packages[name]
    if (config == null)
        config = current_package.config
    localforage.setItem("last_package", name)
    current_storage = localforage.createInstance({ name, ...config })
    await migrate_package()
}

export async function save_package_variable() {
    let packages: Record<string, Package> = await localforage.getItem("packages") ?? {};
    packages[current_package_name()] = current_package
    await localforage.setItem("packages", packages)
}

export function current_package_name(): string {
    return current_storage.config().name ?? DEFAULT_PACKAGE_NAME
}

export async function current_text_filename() {
    return current_package.variable.last_text_filename ?? default_text_filename() 
}

export async function set_text_filename(filename: string) {
    current_package.variable.last_text_filename = filename
    await save_package_variable()
}

export async function text_filenames() {
    return (await current_storage.keys()).filter((s) => s.endsWith(".cdb") || s.endsWith(".txt"))
}

export async function default_text_filename() {
    return (await text_filenames())[0] ?? current_package_name() + ".txt"
}

export async function default_text(): Promise<string> {
    return (await current_storage.getItem(await default_text_filename())) ?? ""
}

export async function current_text() {
    return (await get_item_in_text(await current_text_filename()))
}

export async function accept_package(filename: string, buf: ArrayBuffer, callback?: (index: number, total: number, filename: string) => void) {
    await set_package(generate_package_name_from_filename(filename))
    let reader = new ZipReader(new BlobReader(new Blob([buf])));
    let entries = await reader.getEntries()
    let total = entries.length
    await Promise.all(entries.map((entry, index) => {
        let then_callback = () => callback?.call(null, index, total, entry.filename)
        if (entry.filename.endsWith(".cdb"))
            return read_blob(entry).then((blob) => save_database(entry.filename, blob)).then(then_callback)
        else if (entry.filename.endsWith(".lua") || entry.filename.endsWith(".ini") || entry.filename.endsWith(".conf") || entry.filename.endsWith(".txt"))
            return read_text(entry).then((text) => current_storage.setItem(entry.filename, text)).then(then_callback)
        else if (entry.filename.startsWith("pico/") && entry.compressedSize > 0)
            return read_blob(entry).then((blob) => current_storage.setItem(entry.filename, blob)).then(then_callback)
        else if (entry.filename.startsWith("pics/") && entry.compressedSize > 0) 
            return read_blob(entry).then((blob) => current_storage.setItem(entry.filename, blob)).then(then_callback)
        else 
            console.warn(`File ignored: ${entry.filename}`)
        return null
    }))
    await reader.close()
}

export async function save_database(filename: string, buf: ArrayBuffer | string) {
    let text;
    if (typeof buf == 'string')
        text = buf;
    else {
        let cards = read_from_array_buffer(buf);
        text = cards.map(format).join("\n\n")
    }
    return current_storage.setItem(filename, text)
}

export async function accept_database(filename: string, buf: ArrayBuffer | string) {
    let package_name = generate_package_name_from_filename(filename);
    await set_package(package_name);
    await save_database(package_name + ".cdb", buf)
}

export function generate_package_name_from_filename(filename: string) {
    let index = filename.lastIndexOf('.')
    return index < 0 ? filename : filename.substring(0, index)
}

export async function delete_package(package_name: string) {
    localforage.dropInstance({ name: package_name })
    let packages = await localforage.getItem('packages') as Record<string, PackageConfig>
    delete packages[package_name]
    await localforage.setItem('packages', packages)
}

async function read_blob(entry: Entry): Promise<ArrayBuffer> {
    let writer = new BlobWriter()
    let blob = await entry.getData?.(writer) as Blob
    return blob.arrayBuffer()
}

async function read_text(entry: Entry): Promise<string> {
    let writer = new TextWriter()
    return await entry.getData?.(writer) as string
}

export async function dump(storage: LocalForage) {
    let data: Record<string, any> = {}
    await storage.iterate((value: any, key: string) => { data[key] = value; return })
    return data
}

export async function generate_package(files?: Record<string, string>, callback?: (index: number, total: number, name: string) => void) {
    let zip_file_writer = new BlobWriter();
    let zip_writer = new ZipWriter(zip_file_writer);
    let filenames = files == null ? (await current_storage.keys()) : Object.keys(files)
    let total = filenames.length
    let written: Record<string, boolean> = {}
    for (let i = 0; i < total; i++) {
        let filename = filenames[i];
        callback?.call(null, i, total, filename)
        if (filename.startsWith('pico/') || filename.startsWith(".")) continue
        else if (filename.endsWith(".txt")) {
            let database = generate_from_text(files?.[filename] ?? (await current_storage.getItem(filename)) as string)
            filename = filename.substring(0, filename.length - 4) + ".cdb"
            await zip_writer.add(filename, new BlobReader(new Blob([database])))
            written[filename] = true
        } else if (filename.endsWith(".cdb")) {
            if (written[filename]) continue
            if (filenames.indexOf(filename.substring(0, filename.length - 4) + ".txt") >= 0) continue
            let database = await get_item_in_binary(filename) 
            const bytes = new Uint8Array(database)
            await zip_writer.add(filename, new BlobReader(new Blob([bytes.buffer])))
        } else {
            let item = await current_storage.getItem(filename) as any;
            if (item == null) continue
            if (typeof item == 'string')
                await zip_writer.add(filename, new TextReader(item))
            else if (item.toString && item.toString() == '[object ArrayBuffer]')
                await zip_writer.add(filename, new BlobReader(new Blob([item as ArrayBuffer])))
        }
    }
    zip_writer.close()
    return await zip_file_writer.getData();
}

async function _get_item_in(key: string, form: 'text' | 'binary'): Promise<string | ArrayBufferLike> {
    let text = (await current_storage.getItem(key) as string) ?? ""
    if (current_storage.driver().trim() == 'webdav' && text.startsWith("SQLite format")) {
        let binary = await current_storage.getItem(key + "@binary") as ArrayBuffer
        if (form == 'text')
            return read_from_array_buffer(binary).map(format).join("\n\n")
        else
            return binary
    } 
    else if (form == 'text')
        return text
    else
        return generate_from_text(text).buffer
        
}

export async function get_item_in_text(key: string): Promise<string> {
    return _get_item_in(key, 'text').then((r) => r as string)
}

export async function get_item_in_binary(key: string): Promise<ArrayBuffer> {
    return _get_item_in(key, 'binary').then((r) => r as ArrayBuffer)
}
