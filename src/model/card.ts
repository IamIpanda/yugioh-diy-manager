import { Data } from 'yugioh-card-react'
import * as transformer from 'cdb-transformer'
import Sqlite3InitModule, { Sqlite3Static } from '@sqlite.org/sqlite-wasm'

export type ImageCard = Data.Card;
export type BinaryCard = transformer.Card;
export type Card = BinaryCard & ImageCard & {
    main_type: number,
    prefix_type: number,
    sub_type: number[],
    left_scale: number,
    right_scale: number,
    setcode1: number,
    setcode2: number,
    setcode3: number,
    setcode4: number,
    length_fix: number,
};

function separate_bits(n: number) {
    let bits = []
    let j = 1
    while (j <= n) {
        if ((j & n) > 0) bits.push(j)
        j = j << 1
    }
    return bits
}

function add(a: number, b: number) {
    return a + b
}

export const TYPE_NAMES: Map<number, string> = new Map(transformer.type_names());
export const RACE_NAMES: Map<number, string> = new Map(transformer.race_names());
export const ATTRIBUTE_NAMES: Map<number, string> = new Map(transformer.attribute_names());
export const CATEGORY_NAMES: Map<number, string> = new Map(transformer.category_names());
export const LINKER_NAMES: Map<number, string> = new Map(transformer.linker_names());
export const SUB_TYPES = Data.Type.Fusion + Data.Type.Ritual + Data.Type.Spirit + Data.Type.Union + Data.Type.Dual + Data.Type.Tuner + Data.Type.Synchro +
    Data.Type.Flip + Data.Type.Toon + Data.Type.Xyz + Data.Type.Pendulum + Data.Type.Spsummon + Data.Type.Link
export const EX_TYPES = Data.Type.Ritual + Data.Type.Synchro + Data.Type.Xyz + Data.Type.Link + Data.Type.Fusion;
export const PREFIXES: Record<number, number[]> = {
    [Data.Type.Monster]: [Data.Type.Normal, Data.Type.Effect, Data.Type.Token],
    [Data.Type.Spell]: [0, Data.Type.Ritual, Data.Type.Quickplay, Data.Type.Continuous, Data.Type.Equip, Data.Type.Field],
    [Data.Type.Trap]: [0, Data.Type.Continuous, Data.Type.Counter]
}
export const PREFIEX_SUMS: Record<number, number> = {
    [Data.Type.Monster]: PREFIXES[Data.Type.Monster].reduce(add),
    [Data.Type.Spell]: PREFIXES[Data.Type.Spell].reduce(add),
    [Data.Type.Trap]: PREFIXES[Data.Type.Trap].reduce(add),
}

export let Sqlite3: Sqlite3Static;
Sqlite3InitModule({ print: console.log, printErr: console.error}).then((r) => Sqlite3 = r);

export function transform_card_data(card: BinaryCard, rules?: RegExp[]): Card {
    let subtype_text = undefined;
    if ((card.type & Data.Type.Monster) > 0)
        subtype_text = transformer.format_race(card.race) + "族" + transformer.format_subtype(card.type).replace("/非效果", "")
            + ((card.type & Data.Type.Effect) > 0 ? "/效果" : "")
    let is_oscillulam = (card.type & Data.Type.Pendulum) > 0 && (card.type & Data.Type.Trap) > 0
    if (is_oscillulam) subtype_text = subtype_text?.replace("灵摆", "冥摆")
    let metas = card.metas
    if (metas)
        for (let meta of card.metas!)
            switch(meta) {
                case "翼神龙": metas.push("winged-dragon"); break;
                case "巨神兵": metas.push("tormentor"); break;
                case "天空龙": metas.push("sky-dragon"); break;
            }
    let desc = new Description(card.desc, rules)    
    
    let length_fix: {full: number | null} = { full: null };
    let card_hybrid = Object.create(card, {
        subtype_text: { value: subtype_text },
        metas: { value: metas },
        main_type: {
            enumerable: true, 
            get() { return card.type & 7 }, 
            set(v) { card.type = card.type & ~7 | v } 
        },
        prefix_type: {
            enumerable: true, 
            get() { return card.type & PREFIEX_SUMS[card.type & 7] }, 
            set(v) { card.type = card.type & ~PREFIEX_SUMS[card.type & 7] | v; }
        },
        sub_type: {
            enumerable: true, 
            get() { return separate_bits(card.type & SUB_TYPES) }, 
            set(v) { 
                let pendulum_before = (card.type & Data.Type.Pendulum) > 0
                let pendulum_after = (v & Data.Type.Pendulum) > 0
                card.type = card.type &~SUB_TYPES | v.reduce(add, 0) 
                if (!pendulum_before && pendulum_after) desc.insert_pendulum(v)
                if (pendulum_before && !pendulum_after) desc.delete_pendulum()
                if (pendulum_before !== pendulum_after) card.desc = desc.toString()
            } 
        },
        setcode1: {
            enumerable: true,
            get() { return Number(card.setcode >> 0n & 0xffffn) },
            set(v) { card.setcode = card.setcode & ~0xffffn | BigInt(v) }
        },
        setcode2: {
            enumerable: true,
            get() { return Number(card.setcode >> 16n & 0xffffn) },
            set(v) { card.setcode = card.setcode & ~(0xffffn << 16n) | (BigInt(v) << 16n) }
        },
        setcode3: {
            enumerable: true,
            get() { return Number(card.setcode >> 32n & 0xffffn) },
            set(v) { card.setcode = card.setcode & ~(0xffffn << 32n) | (BigInt(v) << 32n) }
        },
        setcode4: {
            enumerable: true,
            get() { return Number(card.setcode >> 48n & 0xffffn) },
            set(v) { card.setcode = card.setcode & ~(0xffffn << 48n) | (BigInt(v) << 48n) }
        },
        desc: { 
            get() { return desc.desc },
            set(v) { desc.desc = v; card.desc = desc.toString(); }
        },
        pendulum_text: { 
            get() { return desc.pendulum_desc ?? "" },
            set(v) { desc.pendulum_desc = v; card.desc = desc.toString(); }
        },
        flavor_text: {
            value: desc.flavor_text
        },
        length_fix: {
            get() { return length_fix.full },
            set(v) { length_fix.full = v }
        },
        left_scale: {
            get() { return card.lscale },
            set(v) { card.lscale = v; desc.reformat_pendulum_scale(v, card.rscale); card.desc = desc.toString() }
        },
        right_scale: {
            get() { return card.rscale },
            set(v) { card.rscale = v; desc.reformat_pendulum_scale(card.lscale, v); card.desc = desc.toString() }
        }
    })
    return card_hybrid
}

class Description {
    pendulum_header: string | null = null
    pendulum_desc: string | null = null
    divider: string | null = null
    desc: string | null = null
    flavor_text: string |  null = null
    components: Array<string | number> = []
    origin_length: number = 0

    constructor(desc: string, rules?: RegExp[]) {
        this.origin_length = desc.length
        let current_component: 1 | 3 = 3;
        for (let line of desc.split("\n")) {
            if ((rules ?? []).some((r) => r.test(line)))
                this.components.push(line)
            else if (line.includes("【灵摆】")) {
                this.components.push(0)
                this.pendulum_header = line;
                current_component = 1;
            }
            else if (line === "【怪兽效果】" || line === "【怪兽描述】") {
                this.divider = line;
                if (! this.components.includes(1)) this.components.push(1)
                this.components.push(2)
                current_component = 3;
            }
            else if (line.startsWith("★")) {
                if (! this.components.includes(4))
                    this.components.push(4)
                this.flavor_text = (this.flavor_text == null ? "" : this.flavor_text + "\n") + line.substring(1).trim()
            }
            else {
                if (! this.components.includes(current_component))
                    this.components.push(current_component)
                if (current_component == 1)
                    this.pendulum_desc = (this.pendulum_desc == null ? "" : this.pendulum_desc + "\n") + line
                else
                    this.desc = (this.desc == null ? "" : this.desc + "\n") + line
            }
        }
    }

    toString() {
        let str = ""
        for (let component of this.components) {
            if (str.length > 0) str += "\n"
            if (typeof component == 'number') {
                switch(component) {
                    case 0: str += this.pendulum_header ?? ""; break
                    case 1: str += this.pendulum_desc ?? "";   break
                    case 2: str += this.divider ?? "";         break
                    case 3: str += this.desc ?? "";            break
                    case 4: str += this.flavor_text ?? "";     break
                }
            }
            else
                str += component + "\n"
        }
        return str;
    }

    insert_pendulum(type: Data.Type) {
        this.delete_pendulum()
        this.components = [0, 1, 2, ...this.components]
        if (this.divider == null)
            this.divider = (type & Data.Type.Effect) ? "【怪兽效果】" : "【怪兽描述】"
        if (this.pendulum_header == null)
            this.reformat_pendulum_scale(0, 0)
    }

    delete_pendulum() {
        this.components = this.components.filter((n) => ! (typeof n == 'number' && n <= 2))
    }

    reformat_pendulum_scale(lscale: number, rscale: number) {
        this.pendulum_header = `←${lscale} 【灵摆】 ${rscale}→`
    }
}

export function transform_not_effect_rules(str: string): RegExp[] {
    return str.split("\n").filter((s) => s.trim().length > 0).map((s) => new RegExp(s))
}

export function read_from_array_buffer(arr: ArrayBuffer): BinaryCard[] {
    let pointer = Sqlite3.wasm.allocFromTypedArray(arr);
    let database = new Sqlite3.oo1.DB();
    let result_code = Sqlite3.capi.sqlite3_deserialize(database, 'main', pointer, arr.byteLength, arr.byteLength, 0);
    database.checkRc(result_code);
    return transformer.parse_database(database);
}

export function generate_from_text(text: string): Uint8Array {
    let database = new Sqlite3.oo1.DB();
    transformer.write_database(database, text);
    return Sqlite3.capi.sqlite3_js_db_export(database);
}
