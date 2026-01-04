import { useContext, useEffect, useRef, useState } from "react";
import { Table, Modal, Input, GetRef, FloatButton, TableColumnsType, GetProps, Alert, Button } from "antd";
import { AiFillSound, AiOutlineGroup } from "react-icons/ai";

import { parse, Card, format } from 'cdb-transformer'
import { transform_card_data } from "./model/card";
import { AppContext, ConfigContext } from "./model/context";
import { ofuru } from "./model/furigana";

import "./input.css"

const CARD_SEARCH_COLUMNS: TableColumnsType<Card> = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name' }
]

function TextInput() {
    let context = useContext(AppContext)
    let config = useContext(ConfigContext)

    let [diff, set_diff] = useState<any>()
    let [cursor, set_cursor] = useState(0)
    let [dialog, set_dialog] = useState<'category' | 'ofuru' | null>(null)
    let [text, set_text] = useState(context.text);
    let [force_refresh, fuck] = useState(false);

    let main_input = useRef<GetRef<typeof Input>>(null)

    const refresh = () => {
        if (!diff) return;
        let cards = parse(text)
        context.set_context({...context, text, cards})
        set_diff(null)
    }
    useEffect(() => {
        let n = setInterval(refresh, 1000);
        return () => clearInterval(n);
    })
    useEffect(refresh, [force_refresh])
    useEffect(() => set_text(context.text), [context.text])
    useEffect(() => {
        if (context.cards.length == 0) return;
        let _card = context.cards.find((card) => card.range != null && card.range.start <= cursor && card.range.end >= cursor)
        if (_card != null) context.set_context({...context, card: transform_card_data(_card, config.not_effect_rules)})
    }, [context.cards, cursor])
    const handler = () => {
        let element = (main_input.current as any).resizableTextArea.textArea;
        if (element === document.activeElement) set_cursor(element.selectionStart); 
    }
    useEffect(() => {
        if (main_input.current == null) return
        document.addEventListener('selectionchange', handler)
        return () => document.removeEventListener("selectionchange", handler)
    }, [main_input.current])
    useEffect(() => {
        if (context.card == null || diff) return
        let new_text = format(context.card);
        let range = context.card.range!;
        let end = range.end + (context.card.length_fix ?? 0)
        set_text(text.slice(0, range.start) + new_text + "\n" + text.slice(end, text.length))
        context.card.length_fix = new_text.length - (range.end - range.start) + 1
        if (context.disable_refresh) return;
        set_diff(true)
        fuck(!force_refresh)
    }, [context.card_signal]) 
    return <div class="full" id="input">
    <Input.TextArea 
        id="text-area" placeholder="在此输入卡片文本..." className="text full"
            value={text} ref={main_input}
            onChange={(e) => { set_text(e.currentTarget.value); set_diff(true); } }
        style={{ height: '100%' }}
    />
    {/* @ts-ignore */}
    <FloatButton className="button-category" icon={<AiOutlineGroup />} tooltip="卡片目录" onClick={() => { set_dialog('category') }} />
    {/* @ts-ignore */}
    {context.card && context.card?.metas?.indexOf("日语") >= 0 && <FloatButton className="button-category-2" icon={<AiFillSound/>} tooltip="注音" onClick={() => { set_dialog('ofuru') }} />}
    
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
