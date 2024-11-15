import localforage from "localforage";
import { BlobReader, BlobWriter, Entry, TextReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js"
import { DEFAULT_PACKAGE_NAME, default_values, mydiy_values } from "./default"
import { generate_from_text, read_from_array_buffer } from "./card";
import { format } from "cdb-transformer";

const MAGIC_DATABASE_NAME_FIELD = "name"
export let current_storage: LocalForage;

export async function init_storage() {
    localforage.config({ name: 'ygopro-diy-mnager' })

    // Init config values
    for (let key in default_values)
        if (await localforage.getItem(key) == null)
            await localforage.setItem(key, (default_values as any)[key])
        
    // Init current config values
    let last_pacakge_name: string = await localforage.getItem('last_package') ?? DEFAULT_PACKAGE_NAME
    current_storage = localforage.createInstance({ name: last_pacakge_name });
    // If this package already gone by some reason, reset to default.
    if (await current_storage.getItem(MAGIC_DATABASE_NAME_FIELD) == null) {
        console.error(`Seems storage ${last_pacakge_name} already gone.`)
        localforage.dropInstance({ name: last_pacakge_name }) 
        current_storage = localforage.createInstance({ name: DEFAULT_PACKAGE_NAME })
        localforage.setItem('last_package', DEFAULT_PACKAGE_NAME)
    }
    if (last_pacakge_name == DEFAULT_PACKAGE_NAME)
        await load_default_package()
}

export async function load_default_package() {
    for (let key in mydiy_values)
        if (await current_storage.getItem(key) == null)
            await current_storage.setItem(key, (mydiy_values as any)[key])
}

export async function package_list(): Promise<string[]> {
    return (await localforage.getItem('packages')) ?? default_values.packages    
}

export async function set_package(name: string) {
    let packages: string[] = await localforage.getItem("packages") ?? [];
    if (packages.indexOf(name) < 0) await localforage.setItem("packages", [...packages, name])
    localforage.setItem("last_package", name)
    current_storage = localforage.createInstance({ name })
    if (await current_storage.getItem(MAGIC_DATABASE_NAME_FIELD) == null)
        await current_storage.setItem(MAGIC_DATABASE_NAME_FIELD, name)
}

export async function default_text_filename() {
    return (await current_storage.keys()).find((s) => s.endsWith(".cdb")) ?? (await current_storage.getItem(MAGIC_DATABASE_NAME_FIELD) ?? DEFAULT_PACKAGE_NAME) + ".cdb"
}

export async function default_text(): Promise<string> {
    return (await current_storage.getItem(await default_text_filename())) ?? ""
}

export async function text_filenames() {
    return (await current_storage.keys()).filter((s) => s.endsWith(".cdb"))
}

export async function current_package_name(): Promise<string> {
    return (await current_storage.getItem(MAGIC_DATABASE_NAME_FIELD))!
}

export async function accept_package(filename: string, buf: ArrayBuffer, callback?: (index: number, total: number, filename: string) => void) {
    await set_package(get_package_name(filename))
    let reader = new ZipReader(new BlobReader(new Blob([buf])));
    let entries = await reader.getEntries()
    let total = entries.length
    await Promise.all(entries.map((entry, index) => {
        let then_callback = () => callback?.call(null, index, total, entry.filename)
        if (entry.filename.endsWith(".cdb"))
            return read_blob(entry).then((blob) => save_database(entry.filename, blob)).then(then_callback)
        else if (entry.filename.endsWith(".lua") || entry.filename.endsWith(".ini") || entry.filename.endsWith(".conf"))
            return read_text(entry).then((text) => current_storage.setItem(entry.filename, text)).then(then_callback)
        else if (entry.filename.startsWith("pico/") && entry.compressedSize > 0)
            return read_blob(entry).then((blob) => current_storage.setItem(entry.filename, blob)).then(then_callback)
        else if (entry.filename.startsWith("pics/") && entry.compressedSize > 0) 
            return read_blob(entry).then((blob) => current_storage.setItem(entry.filename, blob)).then(then_callback)
        else 
            console.warn(`File ignored: ${entry.filename}`)
        return null
    }))
    reader.close
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
    let package_name = get_package_name(filename);
    await set_package(package_name);
    await save_database(package_name + ".cdb", buf)
}

export function get_package_name(filename: string) {
    let index = filename.lastIndexOf('.')
    return index < 0 ? filename : filename.substring(0, index)
}

export async function delete_package(package_name: string) {
    localforage.dropInstance({ name: package_name })
    let packages = await localforage.getItem('packages') as string[]
    let index = packages.indexOf(package_name)
    if (index >= 0 && package_name != DEFAULT_PACKAGE_NAME) {
        packages.splice(index, 1)
        await localforage.setItem('packages', packages)
    }
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

export async function generate_package(callback?: (index: number, total: number, name: string) => void) {
    let zip_file_writer = new BlobWriter();
    let zip_writer = new ZipWriter(zip_file_writer);
    let filenames = await current_storage.keys();
    let total = filenames.length
    for (let i = 0; i < total; i++) {
        let filename = filenames[i];
        callback?.call(null, i, total, filename)
        if (filename == 'name' || filename.startsWith('pico/')) continue
        else if (filename.endsWith(".cdb") || filename.endsWith(".txt")) {
            let database = generate_from_text(await current_storage.getItem(filename) as string)
            await zip_writer.add(filename, new BlobReader(new Blob([database])))
        } else {
            let item = await current_storage.getItem(filename) as any;
            if (typeof item == 'string')
                await zip_writer.add(filename, new TextReader(item))
            else if (item.toString && item.toString() == '[object ArrayBuffer]')
                await zip_writer.add(filename, new BlobReader(new Blob([item as ArrayBuffer])))
        }
    }
    zip_writer.close()
    return await zip_file_writer.getData();
}
