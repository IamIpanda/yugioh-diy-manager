
import * as transformer from "cdb-transformer";
import { createContext } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";
import { Data } from 'yugioh-card-react';
import { BinaryCard, Card, transform_card_data, transform_not_effect_rules } from "./card";
import localforage from "localforage";
import { default_values } from "./default";
import { current_package_name, current_storage, current_text_filename, get_item_in_text, init_storage, text_filenames } from "./storage";
import { build_trie, TrieNode } from "./furigana";

type ZH_CN_Style = Data.ZH_CN_Style;

const AutoRemoveNewLineOptions = ['before_order', 'aggressive', 'off'] as const
export type AutoRemoveNewLineOption = typeof AutoRemoveNewLineOptions[number]
function is_auto_remove_newline_option(value: any): value is AutoRemoveNewLineOption {
    return AutoRemoveNewLineOptions.includes(value)

}
export type ImageConfig = {
    render_engine: 'html2canvas' | 'dom-to-image'
    large_image: boolean
    scale: number
}
export type HistoryConfig = {
    enabled: boolean
    max_count: number
    min_interval: number
}
export type Config = {
    auto_remove_newline: AutoRemoveNewLineOption,
    strings: string,
    not_effect_rules: RegExp[],
    ofurus: TrieNode,
    image: ImageConfig,
    zh_cn_style: ZH_CN_Style,
    history: HistoryConfig,
    isDark: boolean,
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
    selected_cards: Record<string, BinaryCard[]>,
    saving: boolean,
    loading?: string,
    set_context: Dispatch<StateUpdater<Context>>
}

await init_storage()
let plain_default_config_value: typeof default_values.config = (await localforage.getItem('config')) ?? default_values.config;
export let default_config_value: Config = {
    ...plain_default_config_value,
    auto_remove_newline: is_auto_remove_newline_option(plain_default_config_value.auto_remove_newline) ? plain_default_config_value.auto_remove_newline : default_values.config.auto_remove_newline as AutoRemoveNewLineOption,
    not_effect_rules: transform_not_effect_rules(plain_default_config_value.not_effect_rules),
    ofurus: build_trie(typeof plain_default_config_value.ofurus === 'string' ? plain_default_config_value.ofurus : default_values.config.ofurus),
    image: { ...default_values.config.image, ...plain_default_config_value.image },
    zh_cn_style: (plain_default_config_value.zh_cn_style ?? default_values.config.zh_cn_style) as any as ZH_CN_Style,
    history: { ...default_values.config.history, ...plain_default_config_value.history },
    set_config: null as any,
    isDark: false,
}

export async function load_context(callback?: (message: string) => void) {
    let package_name = await current_package_name();
    callback?.(`正在加载卡片数据包: ${package_name}...`)
    let filenames = await text_filenames();
    callback?.(`正在加载卡片数据包: ${package_name} (${filenames.length} 个文件)...`)
    let filename = await current_text_filename();
    if (filename.endsWith(".cdb")) {
        let txt_name = filename.substring(0, filename.length - 4) + ".txt"
        if (filenames.includes(txt_name)) filename = txt_name
    }
    callback?.(`正在加载卡片数据包: ${package_name} (${filenames.length} 个文件)，当前文件: ${filename}...`)
    let text: string = (await get_item_in_text(filename)) ?? "空卡片(10000) 通常魔法\n似乎找不到卡片。"
    // <Input> only accept \n as new line, but some files may contain \r\n, so we need to replace them before parse.
    // Or we will get wrong card range because \r will be counted as a character.
    text = text.replace(/\r\n/g, "\n")
    callback?.(`正在加载卡片数据包: ${package_name} (${filenames.length} 个文件)，当前文件: ${filename}，正在解析卡片数据...`)
    let cards = transformer.parse(text) 
    callback?.(`正在加载卡片数据包: ${package_name} (${filenames.length} 个文件)，当前文件: ${filename}，已解析 ${cards.length} 张卡片。`)
    let card = cards.length > 0 ? transform_card_data(cards[0]) : undefined
    if (filename.endsWith(".cdb"))
        filename = filename.substring(0, filename.length - 4) + ".txt"
    return { package_name, filenames, filename, text, card, cards }
}

export async function reload_context(context: Context) {
    let callback = (message: string) => context.set_context({ ...context, loading: message })
    try {
        context.set_context({...context, ...(await load_context(callback)), loading: undefined})
    }
    catch(e) {
        console.error(e)
        let package_name = await current_package_name()
        let error_filename = "error_hint.txt"
        let error_text = `# 数据库【${context.filename || package_name}】读取失败.`
        context.set_context({...context, loading: undefined, text: error_text, filename: error_filename, filenames: context.filenames || [error_filename]})
    }
}

export async function load_strings(config: Config) {
    let file = await current_storage.getItem("strings.conf") as string | null
    if (file == null) file = ""
    transformer.set_string_conf(config.strings + "\n" + file)
}

export const default_context_value: Context = {
    // This part shall be loaded by load_context
    package_name: "Loading",
    filenames: [],
    filename: "",
    text: "",
    cards: [],
    
    selected_cards: {},
    saving: false,
    card_signal: false,
    disable_refresh: false,
    set_context: null as any
}

export const AppContext = createContext(default_context_value)
export const ConfigContext = createContext(default_config_value)
