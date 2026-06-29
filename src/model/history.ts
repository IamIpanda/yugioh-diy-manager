import dayjs from "dayjs";

import { current_storage } from "./storage";
import { HistoryConfig } from "./context";

function history_pattern(filename: string): { prefix: string; suffix: string } {
    let dot = filename.lastIndexOf('.');
    let base = dot < 0 ? filename : filename.substring(0, dot);
    let extension = dot < 0 ? "" : filename.substring(dot);
    return { prefix: `.history/${base}_`, suffix: extension };
}

function history_key(filename: string): string {
    let { prefix, suffix } = history_pattern(filename);
    let timestamp = dayjs().format("YYYYMMDDHHmmss");
    return `${prefix}${timestamp}${suffix}`;
}

export function history_timestamp(key: string): dayjs.Dayjs | null {
    let underscore = key.lastIndexOf('_');
    let dot = key.lastIndexOf('.');
    if (underscore < 0 || dot < underscore) return null;
    let timestamp = key.substring(underscore + 1, dot);
    if (timestamp.length !== 14) return null;
    return dayjs(timestamp, "YYYYMMDDHHmmss");
}

export async function list_history(filename: string): Promise<string[]> {
    let { prefix, suffix } = history_pattern(filename);
    let keys = await current_storage.keys();
    return keys.filter((k) => k.startsWith(prefix) && k.endsWith(suffix)).sort();
}

export async function persist(filename: string, text: string, history: HistoryConfig): Promise<void> {
    await current_storage.setItem(filename, text);
    if (!history.enabled) return;

    let entries = await list_history(filename);

    if (history.min_interval > 0 && entries.length > 0) {
        let last_timestamp = history_timestamp(entries[entries.length - 1]);
        if (last_timestamp && dayjs().diff(last_timestamp, 'second') < history.min_interval)
            return;
    }

    if (entries.length > 0) {
        let last_text = await current_storage.getItem<string>(entries[entries.length - 1]);
        if (last_text === text) return;
    }

    let key = history_key(filename);
    await current_storage.setItem(key, text);

    if (history.max_count > 0 && entries.length >= history.max_count) {
        let overflow = entries.slice(0, entries.length - history.max_count + 1);
        for (let key of overflow)
            current_storage.removeItem(key);
    }
}
