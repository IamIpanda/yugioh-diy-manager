
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from 'dayjs'
import { Table, Modal, Input, GetRef, TableColumnsType, GetProps, Alert, Button, Tooltip, Row, Col, Spin, Switch } from "antd";
import { AiFillSound, AiOutlineGroup, AiOutlineSave, AiOutlineHistory } from "react-icons/ai";
import { DiffEditor } from "@monaco-editor/react";

import { parse, Card, format } from 'cdb-transformer'
import { transform_card_data } from "./model/card";
import { AppContext, ConfigContext } from "./model/context";
import { ofuru } from "./model/furigana";
import { list_history, history_timestamp } from "./model/history";
import { current_storage } from "./model/storage";
import "./input.css"

const CARD_SEARCH_COLUMNS: TableColumnsType<Card> = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name' }
]

function TextInput() {
    let context = useContext(AppContext)
    let config = useContext(ConfigContext)

    let [cursor, set_cursor] = useState(0)
    let [dialog, set_dialog] = useState<'category' | 'ofuru' | 'history' | null>(null)
    let [lastSaved, set_lastSaved] = useState<dayjs.Dayjs | null>(null)
    let [text, set_text] = useState(context.text);

    let main_input = useRef<GetRef<typeof Input>>(null)
    let current_card_ref = useRef<Card | undefined>()
    let parse_timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    let cursor_raf = useRef(0)
    let needs_refresh = useRef(false)
    let text_ref = useRef(text)
    let context_ref = useRef(context)
    text_ref.current = text
    context_ref.current = context

    const scheduleRefresh = (delay = 1000) => {
        needs_refresh.current = true
        if (parse_timer.current != null) clearTimeout(parse_timer.current)
        parse_timer.current = setTimeout(() => {
            parse_timer.current = null
            if (!needs_refresh.current) return
            needs_refresh.current = false
            let t = text_ref.current
            let cards = parse(t)
            let ctx = context_ref.current
            ctx.set_context({...ctx, text: t, cards})
        }, delay)
    }

    const save = () => {
        let ctx = context_ref.current
        ctx.set_context({...ctx, text: text_ref.current, saving: true})
    }

    useEffect(() => () => { if (parse_timer.current != null) clearTimeout(parse_timer.current) }, [])
    useEffect(() => { if (context.text !== text_ref.current) set_text(context.text) }, [context.text])
    useEffect(() => {
        if (context.cards.length == 0) return;
        let _card = context.cards.find((card) => card.range != null && card.range.start <= cursor && card.range.end >= cursor)
        if (_card != null && _card !== current_card_ref.current) {
            current_card_ref.current = _card;
            let new_card = transform_card_data(_card, config.not_effect_rules)
            context.set_context({...context, card: new_card})
        }
    }, [context.cards, cursor])
    useEffect(() => {
        if (context.card == null || needs_refresh.current) return
        let new_text = format(context.card);
        let range = context.card.range!;
        let end = range.end + (context.card.length_fix ?? 0)
        set_text(text.slice(0, range.start) + new_text + "\n" + text.slice(end, text.length))
        context.card.length_fix = new_text.length - (range.end - range.start) + 1
        if (context.disable_refresh) return;
        scheduleRefresh()
    }, [context.card_signal])

    const handler = () => {
        let element = (main_input.current as any)?.resizableTextArea?.textArea;
        if (element === document.activeElement) {
            cancelAnimationFrame(cursor_raf.current);
            cursor_raf.current = requestAnimationFrame(() => {
                set_cursor(element.selectionStart);
            });
        }
    }
    useEffect(() => {
        if (main_input.current == null) return
        document.addEventListener('selectionchange', handler)
        return () => {
            document.removeEventListener("selectionchange", handler)
            cancelAnimationFrame(cursor_raf.current)
        }
    }, [main_input.current])

    useEffect(() => { if (!context.saving && context.filename) set_lastSaved(dayjs()) }, [context.saving])
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                save()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])
    
    return <div class="full" id="input">
    <Input.TextArea 
        id="text-area" placeholder="在此输入卡片文本..." className="text full"
            value={text} ref={main_input}
            onChange={(e) => { set_text(e.currentTarget.value); scheduleRefresh(); } }
        style={{ height: '100%' }}
    />
    <div class="input-toolbar">
        <Tooltip title={context.saving ? '保存中...' : <div>保存 (Ctrl+S){lastSaved ? <><br />上次保存: {lastSaved.format("HH:mm:ss")}</> : ''}</div>}>
            <Button type="text" size="small" icon={<AiOutlineSave />} loading={context.saving} onClick={save} />
        </Tooltip>
        <Tooltip title="历史记录">
            <Button type="text" size="small" icon={<AiOutlineHistory />} onClick={() => set_dialog('history')} />
        </Tooltip>
        <Tooltip title="卡片目录">
            <Button type="text" size="small" icon={<AiOutlineGroup />} onClick={() => set_dialog('category')} />
        </Tooltip>
        {context.card && context.card?.metas?.indexOf("日语") >= 0 && (
            <Tooltip title="注音">
                <Button type="text" size="small" icon={<AiFillSound />} onClick={() => set_dialog('ofuru')} />
            </Tooltip>
        )}
    </div>
    
    <CategoryModal open={dialog === 'category'} onCancel={() => set_dialog(null)} onOk={
        (record: Card) => {
            set_dialog(null)
            let element: HTMLTextAreaElement = (main_input.current as any)?.resizableTextArea?.textArea;
            if (element == null || record.range == null) return;
            element.value = context.text.substring(0, record.range.start);
            let scroll_height = element.scrollHeight;
            element.value = context.text;
            if (scroll_height > element.offsetHeight)
                scroll_height -= element.offsetHeight / 2;
            else
                scroll_height = 0
            element.focus()
            element.setSelectionRange(record.range.start, record.range.end)
            element.scrollTop = scroll_height
        }
    } />
    <OfuruModal open={dialog === 'ofuru'} onCancel={() => set_dialog(null)} />
    <HistoryModal open={dialog === 'history'} onCancel={() => set_dialog(null)} filename={context.filename} currentText={text} onRestore={(t) => { set_text(t); scheduleRefresh(); }} />
        
    </div>
}

function CategoryModal(props: Omit<GetProps<typeof Modal>, 'onOk'> & { onOk: (record: Card) => void }) {
    let { onOk, ...modal_props } = props
    let [search, set_search] = useState("")
    let search_input = useRef<GetRef<typeof Input>>(null)
    let context = useContext(AppContext)
    return <Modal title="卡片目录"
        className="card-category-modal"
        footer={null}
        focusTriggerAfterClose={false}
        afterOpenChange={(o) => { if (o) (search_input.current as any)?.select(); }}
        {...modal_props}>
        <Input ref={search_input} style={{ margin: '10px 0px' }} placeholder='搜索卡片...' onChange={(e) => set_search((e.target as HTMLInputElement)?.value ?? "")} />
        <Table<Card>
            virtual
            size="small"
            rowKey="code"
            dataSource={context.cards.filter((c) => c.name.indexOf(search) >= 0 || c.code.toString().indexOf(search) >= 0)}
            pagination={false}
            showHeader={false}
            scroll={{ x: 330, y: 600 }}
            columns={CARD_SEARCH_COLUMNS}
            rowSelection={{ 
                columnWidth: 32, 
                selectedRowKeys: context.selected_cards.map((c) => c.code), 
                onSelect: (_r, _s, rows) => context.set_context({ ...context, selected_cards: rows }), 
                onCell: (_) => ({
                    onClick: (e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }
                })
            }}
            onRow={(record) => {
                return {
                    onClick: onOk.bind(null, record)
                }
            }}
        />
        {(context.selected_cards.length > 0) && <Alert showIcon type="warning" message="勾选了卡的场合，没有勾选的卡会在下载时被移除。" />}
    </Modal>
}

function OfuruModal(props: GetProps<typeof Modal>) {
    let config = useContext(ConfigContext)
    let [content, set_content] = useState("")
    return <Modal
        title="自动注音" 
        footer={<>
            <Button onClick={() =>set_content(ofuru(content, config.ofurus))}>注音</Button>
            <Button onClick={(e) => props.onCancel?.call(null, e as any)}>关闭</Button>
        </>} 
        className="card-ofuru-modal"
        closable={false}
        {...props}>
        <Input.TextArea className="ofuru-input" value={content} onChange={(e) => set_content((e.target as HTMLTextAreaElement)?.value)} />
    </Modal>
}

type HistoryEntry = { key: string; timestamp: dayjs.Dayjs; text?: string };

function HistoryModal(props: GetProps<typeof Modal> & { filename: string; currentText: string; onRestore: (text: string) => void }) {
    let { filename, currentText, onRestore, ...modal_props } = props;
    let [side_by_side, set_side_by_side] = useState(true);
    let [entries, set_entries] = useState<HistoryEntry[]>([]);
    let [selected, set_selected] = useState<HistoryEntry | null>(null);
    let [loading, set_loading] = useState(false);

    let load = async () => {
        if (!filename) return;
        set_loading(true);
        let keys = await list_history(filename);
        let result: HistoryEntry[] = [];
        for (let key of keys) {
            let parsed = history_timestamp(key);
            if (parsed == null) continue;
            result.push({ key, timestamp: parsed });
        }
        result = result.reverse()
        set_entries(result);
        set_loading(false);
        if (result.length > 0)
            select(result[0]);
    };

    let select = async (entry: HistoryEntry) => {
        if (entry.text == null)
            entry.text = await current_storage.getItem<string>(entry.key) ?? "";
        set_selected(entry);
    };

    useEffect(() => { if (props.open) load(); }, [props.open, filename]);

    return <Modal 
        title={<span>历史记录 <Switch checked={side_by_side} onChange={set_side_by_side} checkedChildren="双框" unCheckedChildren="单框" style={{ marginLeft: 12 }} /></span>}
        className="card-history-modal"
        width={1400} 
        footer={null} 
        closable={false} 
        {...modal_props} 
        destroyOnHidden>
        <Spin spinning={loading}>
            <Row gutter={12}>
                <Col className="history-sidebar" flex="200px">
                    {entries.map((entry) =>
                        <div key={entry.key}
                            className={"history-entry" + (selected?.key === entry.key ? " active" : "")}
                            onClick={() => select(entry)}>
                            {entry.timestamp.format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                    )}
                </Col>
                <Col flex="auto">
                    {selected
                        ? <div key={`${selected.key}_${side_by_side}`}>
                            <DiffEditor
                                height="80vh"
                                language="plaintext"
                                original={selected.text}
                                modified={currentText}
                                theme="vs"
                                options={{ readOnly: true, renderSideBySide: side_by_side, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                            />
                            <div className="history-restore">
                                <Button type="primary" onClick={() => { onRestore(selected.text ?? ""); modal_props.onCancel?.call(null, null as any); }}>恢复到此版本</Button>
                            </div>
                        </div>
                        : null
                    }
                </Col>
            </Row>
        </Spin>
    </Modal>;
}

export default TextInput
/* 
        <AceEditor
            name="input"
            className="yugioh-input"
            theme="github"
            showGutter={false}
            showPrintMargin={false}
            fontSize="inherit"
            wrapEnabled
            style={{ width: '100%', height: '100%' }} />
    /> */
