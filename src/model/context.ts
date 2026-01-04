
import * as transformer from "cdb-transformer";
import { createContext } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";
import { BinaryCard, Card, transform_card_data, transform_not_effect_rules } from "./card";
import localforage from "localforage";
import { default_values } from "./default";
import { current_package_name, current_text_filename, get_item_in_text, init_storage, text_filenames } from "./storage";
import { build_trie, TrieNode } from "./furigana";

export type Config = {
    auto_remove_newline: boolean,
    strings: string,
    not_effect_rules: RegExp[],
    ofurus: TrieNode,
    set_config: Dispatch<StateUpdater<Config>>
}

export type Context = {
    package_name: string,
    filenames: string[],
    filename: string,
    text: string,
    card?: Card,
    card_signal: boolean,
    disable_refresh: boolean,
    cards: BinaryCard[],
    selected_cards: BinaryCard[],
    loading?: string,
    set_context: Dispatch<StateUpdater<Context>>
}

await init_storage()
let plain_default_config_value: typeof default_values.config = (await localforage.getItem('config')) ?? default_values.config;
export let default_config_value: Config = {
    ...plain_default_config_value,
    auto_remove_newline: plain_default_config_value.auto_remove_newline ?? default_values.config.auto_remove_newline,
    not_effect_rules: transform_not_effect_rules(plain_default_config_value.not_effect_rules),
    ofurus: build_trie(typeof plain_default_config_value.ofurus === 'string' ? plain_default_config_value.ofurus : default_values.config.ofurus),
    set_config: null as any,
    
}

export async function load_context() {
    let package_name = await current_package_name();
    let filenames = await text_filenames();
    let filename = await current_text_filename();
    let text: string = (await get_item_in_text(filename)) ?? "空卡片(10000) 通常魔法\n似乎找不到卡片。"
    let cards = transformer.parse(text)
    let card = cards.length > 0 ? transform_card_data(cards[0]) : undefined
    if (filename.endsWith(".cdb"))
        filename = filename.substring(0, filename.length - 4) + ".txt"
    return { package_name, filenames, filename, text, card, cards }
}

export async function reload_context(context: Context) {
    context.set_context({...context, loading: `正在载入 ${context.package_name}...`})
    try {
        context.set_context({...context, ...(await load_context()), loading: undefined})
    }
    catch(e) {
        console.error(e)
    }
}

export async function load_strings(config: Config) {
    let file = await localforage.getItem("strings.conf") as string | null
    if (file == null) file = ""
    transformer.set_string_conf(config.strings + "\n" + file)
}
await load_strings(default_config_value)

export const default_context_value: Context = {
    // This part shall be loaded by load_context
    package_name: "Loading",
    filenames: [],
    filename: "",
    text: "",
    cards: [],
    
    selected_cards: [],
    card_signal: false,
    disable_refresh: false,
    set_context: null as any
}

export const AppContext = createContext(default_context_value)
export const ConfigContext = createContext(default_config_value)
