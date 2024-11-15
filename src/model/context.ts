
import * as transformer from "cdb-transformer";
import { createContext } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";
import { BinaryCard, Card, transform_card_data, transform_not_effect_rules } from "./card";
import localforage from "localforage";
import { default_values } from "./default";
import { current_package_name, current_storage, default_text_filename, init_storage } from "./storage";

export type Config = {
    strings: string,
    not_effect_rules: RegExp[],
    set_config: Dispatch<StateUpdater<Config>>
}

export type Context = {
    package_name: string,
    filename: string,
    text: string,
    card?: Card,
    card_signal: boolean,
    disable_refresh: boolean,
    cards: BinaryCard[],
    loading?: string,
    set_context: Dispatch<StateUpdater<Context>>
}

await init_storage()
let plain_default_config_value: typeof default_values.config = (await localforage.getItem('config')) ?? default_values.config;
export let default_config_value: Config = {
    ...plain_default_config_value,
    not_effect_rules: transform_not_effect_rules(plain_default_config_value.not_effect_rules),
    set_config: null as any
}

export async function load_context() {
    let package_name = await current_package_name();
    let filename = await default_text_filename();
    let text: string = await current_storage.getItem(filename) ?? "空卡片(10000) 通常魔法\n似乎找不到卡片。"
    let cards = transformer.parse(text)
    let card = transform_card_data(cards[0])
    return { package_name, filename, text, card, cards }
}

export async function load_strings(config: Config) {
    let file = await localforage.getItem("strings.conf") as string | null
    if (file == null) file = ""
    transformer.set_string_conf(config.strings + "\n" + file)
}

await load_strings(default_config_value)
export const default_context_value: Context = {
    ...( await load_context() ),
    card_signal: false,
    disable_refresh: false,
    set_context: null as any
}


export const AppContext = createContext(default_context_value)
export const ConfigContext = createContext(default_config_value)
