import { useContext, useEffect, useRef, useState } from "react";
import { Table, Modal, Input, GetRef, FloatButton, TableColumnsType } from "antd";

import { parse, Card, format } from 'cdb-transformer'
import { transform_card_data } from "./model/card";
import { AppContext, ConfigContext } from "./model/context";

import "./input.css"
import { AiOutlineGroup } from "react-icons/ai";

const CARD_SEARCH_COLUMNS: TableColumnsType<Card> = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name' }
]

function TextInput() {
    let context = useContext(AppContext)
    let config = useContext(ConfigContext)

    let [diff, set_diff] = useState<any>()
    let [cursor, set_cursor] = useState(0)
    let [category_open, set_category_open] = useState(false)
    let [search, set_search] = useState("")
    let [text, set_text] = useState(context.text);

    let main_input = useRef<GetRef<typeof Input>>(null)
    let search_input = useRef<GetRef<typeof Input>>(null)

    const refresh = () => {
        if (!diff) return;
        if (context.disable_refresh) return;
        let cards = parse(text)
        context.set_context({...context, text, cards})
        set_diff(null)
    }
    useEffect(() => {
        let n = setInterval(refresh, 1000);
        return () => clearInterval(n);
    })
    useEffect(() => set_text(context.text), [context.text])
    useEffect(() => {
        if (context.cards.length == 0) return;
        let _card = context.cards.find((card) => card.range != null && card.range.start <= cursor && card.range.end >= cursor)
        if (_card != null) context.set_context({...context, card: transform_card_data(_card, config.not_effect_rules)})
    }, [context.cards, cursor])
    const handler = (e: any) => { if (e.target === document.activeElement) set_cursor(e.target.selectionStart); }
    useEffect(() => {
        if (main_input.current == null) return
        let element: HTMLTextAreaElement = (main_input.current as any).resizableTextArea.textArea;
        element.addEventListener('selectionchange', handler)
        return () => element.removeEventListener("selectionchange", handler)
    }, [main_input.current])
    useEffect(() => {
        let new_text = format(context.card);
        let range = context.card.range!;
        let end = range.end + (context.card.length_fix ?? 0)
        set_text(text.slice(0, range.start) + new_text + "\n" + text.slice(end, text.length))
        set_diff(true)
        context.card.length_fix = new_text.length - (range.end - range.start) + 1
    }, [context.card_signal]) 
    return <div class="full" id="input">
    <Input.TextArea 
        id="text-area" placeholder="在此输入卡片文本..." className="text full"
            value={text} ref={main_input}
            onChange={(e) => { set_text(e.currentTarget.value); set_diff(true); } }
        style={{ height: '100%' }}
    />
    {/* @ts-ignore */}
    <FloatButton className="button-category" icon={<AiOutlineGroup />} tooltip="卡片目录" onClick={() => { set_category_open(true) }} />

    <Modal title="卡片目录" onClose={()=>set_category_open(false)} onCancel={()=>set_category_open(false)} open={category_open} footer={null} focusTriggerAfterClose={false}>
        <Input ref={search_input} style={{ margin: '10px 0px' }} placeholder='搜索卡片...' onChange={(e) => set_search((e.target as HTMLInputElement)?.value ?? "")} />
        <Table<Card> 
            virtual
            size="small"
            dataSource={context.cards.filter((c) => c.name.indexOf(search) >= 0 || c.code.toString().indexOf(search) >= 0)} 
            pagination={false} 
            showHeader={false}  
            scroll={{ x: 330, y: 600 }} 
            columns={CARD_SEARCH_COLUMNS}
            onRow={(record) => { return {
                onClick: () => {
                    set_category_open(false);
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
            }}}
        />
    </Modal>
        
    </div>
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
