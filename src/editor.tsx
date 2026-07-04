
import { cloneElement } from "preact";
import { useContext, useEffect, useState, useRef } from "preact/hooks";
import { createContext, HTMLProps, ReactElement } from "preact/compat";
import { Select, InputNumber, Input, Space, SelectProps, Row, Col, GetProps, Modal, Button, Upload, Dropdown, Spin, Image, Checkbox, Flex, Form, Typography, Collapse } from 'antd'

import MonacoEditor from "@monaco-editor/react";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image'
import ImgCrop from "antd-img-crop";

import "./monaco";

import { Card as CardImage, Data } from "yugioh-card-react";
import * as transformer from "cdb-transformer";

import { ofuru } from "./model/furigana";
import { current_storage } from "./model/storage";
import { AppContext, ConfigContext, Context, ImageConfig, load_strings } from "./model/context";
import { ATTRIBUTE_NAMES, Card, CATEGORY_NAMES, EX_TYPES, LINKER_NAMES, PREFIXES, RACE_NAMES, SUB_TYPES, TYPE_NAMES } from "./model/card";

import { AiOutlineContainer, AiOutlineDelete, AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import "./editor.css"
import { DEFAULT_SCRIPT } from "./model/default";

const SUB_TYPE_OPTIONS = new Map(Array.from(TYPE_NAMES).filter((p) => p[0] != 0 && (p[0] & SUB_TYPES) > 0).map((p) => [p[0], { label: p[1], value: p[0] }]))

function transform_map_to_options(map: Map<number, string>) {
    return Array.from(map.entries()).map((v) => ({ label: v[1], value: v[0] }))
}

function Line(props: GetProps<typeof Space.Compact>) {
    return <Space.Compact {...props} style={{ 'width': '100%', paddingBottom: '20px', justifyContent: 'center' }}>{props.children}</Space.Compact>
}

function Select2(props: SelectProps & { fallback?: string }) {
    let { fallback, ...rest_props } = props
    let render: GetProps<typeof Select>['labelRender'] = undefined
    if (fallback) render = (props) => props.label ?? fallback
    return <Select showSearch filterOption={(input, option) => option?.label == null ? false : option.label.toString().indexOf(input) > 0} labelRender={render} style={{ width: '100%' }} {...rest_props} />
}

function LinkMarkerEditor(props: { onChange?: (value: number) => void } & Omit<HTMLProps<HTMLDivElement>, 'onChange'>) {
    const { value, onChange, ...p } = props;
    const keys = [
        [Data.Linkmarker.TopLeft,    Data.Linkmarker.Top,    Data.Linkmarker.TopRight],
        [Data.Linkmarker.Left,       16,                     Data.Linkmarker.Right],
        [Data.Linkmarker.BottomLeft, Data.Linkmarker.Bottom, Data.Linkmarker.BottomRight]
    ]
    // @ts-ignore
    return <div class="link-marker-editor full-width" {...p}>
        <Space direction="vertical">
            {keys.map((group) => <Space>{group.map((marker) => 
                <LinkMarkerCheckbox 
                    chosen={((value as number) & marker) > 0} 
                    value={marker} 
                    text={LINKER_NAMES.get(marker) ?? ""}
                    onClick={() => onChange?.call(null, (value as number) ^ marker )}
            />)}</Space>)}
        </Space>
    </div>
}

function LinkMarkerCheckbox(props: { chosen: boolean, text: string } & GetProps<typeof Button>) {
    const { chosen, value, text, ...p } = props;
    if (value == 16)
        return <div class="link-marker-checkbox" />
    return <Button className="link-marker-checkbox" type={chosen ? 'primary' : 'default'} {...p}>{chosen ? text : ""}</Button>
}

const FormContext = createContext<{ value: Card, hooks: any }>({} as any)
function FormItem(props: { name: keyof Card, children: ReactElement } & HTMLProps<HTMLElement>): ReactElement {
    let form = useContext(FormContext);
    let [react_function_component, fuck] = useState(false)
    let card = form.value as any
    return cloneElement(props.children, { value: card[props.name], onChange: (e: any) => {
        if (e == null) e = 0
        let next_value = e
        if (e.target) next_value = e.target.value
        card[props.name] = next_value
        fuck(!react_function_component)
        form.hooks['onValuesChange']?.call(null, next_value)
    } })
}

function CardForm(props: { formValue: any, onValuesChange?: () => void } & HTMLProps<HTMLDivElement>) {
    return <FormContext.Provider value={{ value: props.formValue, hooks: { onValuesChange: props.onValuesChange } }}>
        {/* @ts-ignore */}
        <div {...props}>{props.children}</div>
    </FormContext.Provider>
}

function MetadataModal(props: { card: Card } & GetProps<typeof Modal>) {
    let { card, onCancel, ...modal_props } = props
    let [form] = Form.useForm()
    let language = Form.useWatch("language", form) ?? "简体中文"

    let metas = card.metas ?? []
    let initial: Record<string, any> = {
        language: "简体中文",
        frame: "默认",
        newline: "遵循全局",
        auto_furigana: false,
        desc_scale_enabled: false,
        desc_scale: 0,
        pdesc_scale_enabled: false,
        pdesc_scale: 0,
        name_override_enabled: false,
        name_override: "",
        zh_cn_style: "",
        god_frame: "",
    }
    for (let m of metas)
        if (m === "日语" || m === "日文") initial.language = "日语"
        else if (m === "韩语" || m === "韩文") initial.language = "韩语"
        else if (m === "全框卡") initial.frame = "全框卡"
        else if (m === "出框卡") initial.frame = "出框卡"
        else if (m === "移除回车") initial.newline = "移除回车"
        else if (m === "移除序号前的回车") initial.newline = "移除序号前的回车"
        else if (m === "保留回车") initial.newline = "保留回车"
        else if (m === "自动注音") initial.auto_furigana = true
        else if (m.startsWith("效果缩放")) { initial.desc_scale_enabled = true; initial.desc_scale = parseFloat(m.substring(5)) }
        else if (m.startsWith("灵摆缩放")) { initial.pdesc_scale_enabled = true; initial.pdesc_scale = parseFloat(m.substring(5)) }
        else if (m.startsWith("替换卡名")) { initial.name_override_enabled = true; initial.name_override = m.substring(4) }
        else if (m === "默认风格") initial.zh_cn_style = "默认风格"
        else if (m === "映蝶风格") initial.zh_cn_style = "映蝶风格"
        else if (m === "ygopro风格") initial.zh_cn_style = "ygopro风格"
        else if (m === "翼神龙") initial.god_frame = "翼神龙"
        else if (m === "巨神兵") initial.god_frame = "巨神兵"
        else if (m === "天空龙") initial.god_frame = "天空龙"
    let exact_keys = ["日语", "日文", "韩语", "韩文", "全框卡", "出框卡", "移除回车", "移除序号前的回车", "保留回车", "自动注音", "默认风格", "映蝶风格", "ygopro风格", "翼神龙", "巨神兵", "天空龙", "winged-dragon", "tormentor", "sky-dragon"]
    let prefix_keys = ["效果缩放","灵摆缩放","替换卡名"]

    return <Modal {...modal_props} footer={null} title={`编辑 ${card.name}(${card.code}) 元信息`} closable={false} width="400px" destroyOnHidden
        onCancel={() => {
            let values = form.getFieldsValue()
            let metas = (card.metas ?? []).filter((m: string) => !exact_keys.includes(m) && !prefix_keys.some((p) => m.startsWith(p)))
            let desc_scale_enabled = form.getFieldValue("desc_scale_enabled")
            let pdesc_scale_enabled = form.getFieldValue("pdesc_scale_enabled")
            let name_override_enabled = form.getFieldValue("name_override_enabled")
            if (values.language && values.language !== "简体中文") metas.push(values.language)
            if (values.frame && values.frame !== "默认") metas.push(values.frame)
            if (values.newline && values.newline !== "遵循全局") metas.push(values.newline)
            if (values.auto_furigana) metas.push("自动注音")
            if (desc_scale_enabled) metas.push(`效果缩放${values.desc_scale}`)
            if (pdesc_scale_enabled) metas.push(`灵摆缩放${values.pdesc_scale}`)
            if (name_override_enabled && values.name_override) metas.push(`替换卡名${values.name_override}`)
            if (values.zh_cn_style) metas.push(values.zh_cn_style)
            if (values.god_frame) metas.push(values.god_frame)
            card.metas = metas.length > 0 ? metas : undefined as any
            onCancel?.(null as any)
        }}>
        <Form form={form} initialValues={initial} labelCol={{ flex: "100px" }} wrapperCol={{ flex: "auto" }}>
            <Form.Item name="language" label="语言">
                <Select options={[{ label: '简体中文', value: '简体中文' }, { label: '日语', value: '日语' }, { label: '韩语', value: '韩语' }]} />
            </Form.Item>
            <Form.Item name="frame" label="卡框风格">
                <Select options={[{ label: '默认', value: '默认' }, { label: '全框', value: '全框卡' }, { label: '出框', value: '出框卡' }]} />
            </Form.Item>
            <Form.Item name="zh_cn_style" label="简体中文风格">
                <Select disabled={language !== "简体中文"} options={[
                    { label: '遵循全局', value: '' },
                    { label: '默认风格（custom1）', value: '默认风格' },
                    { label: '映蝶风格（ygo-sc）', value: '映蝶风格' },
                    { label: 'ygopro风格（custom2）', value: 'ygopro风格' },
                ]} />
            </Form.Item>
            <Form.Item name="newline" label="回车策略">
                <Select options={[
                    { label: '遵循全局', value: '遵循全局' }, 
                    { label: '移除回车', value: '移除回车' }, 
                    { label: '移除序号前的回车', value: '移除序号前的回车' }, 
                    { label: '保留回车', value: '保留回车' }
                ]} />
            </Form.Item>
            <Form.Item name="god_frame" label="幻神卡背">
                <Select options={[
                    { label: '不使用', value: '' },
                    { label: '翼神龙', value: '翼神龙' },
                    { label: '巨神兵', value: '巨神兵' },
                    { label: '天空龙', value: '天空龙' },
                ]} />
            </Form.Item>
            <Form.Item name="auto_furigana" label="自动注音" valuePropName="checked">
                <Checkbox disabled={language !== "日语"} />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(p, c) => p.desc_scale_enabled !== c.desc_scale_enabled}>
                {() =>
                    <Form.Item label={<Checkbox checked={form.getFieldValue("desc_scale_enabled")} onChange={(e) => form.setFieldValue("desc_scale_enabled", e.target.checked)}>效果缩放</Checkbox>}>
                        <Form.Item name="desc_scale" noStyle><InputNumber step={0.1} disabled={!form.getFieldValue("desc_scale_enabled")} /></Form.Item>
                    </Form.Item>
                }
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(p, c) => p.pdesc_scale_enabled !== c.pdesc_scale_enabled}>
                {() =>
                    <Form.Item label={<Checkbox checked={form.getFieldValue("pdesc_scale_enabled")} onChange={(e) => form.setFieldValue("pdesc_scale_enabled", e.target.checked)}>灵摆缩放</Checkbox>}>
                        <Form.Item name="pdesc_scale" noStyle><InputNumber step={0.1} disabled={!form.getFieldValue("pdesc_scale_enabled")} /></Form.Item>
                    </Form.Item>
                }
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(p, c) => p.name_override_enabled !== c.name_override_enabled}>
                {() =>
                    <Form.Item label={<Checkbox checked={form.getFieldValue("name_override_enabled")} onChange={(e) => form.setFieldValue("name_override_enabled", e.target.checked)}>替换卡名</Checkbox>}>
                        <Form.Item name="name_override" noStyle><Input disabled={!form.getFieldValue("name_override_enabled")} /></Form.Item>
                    </Form.Item>
                }
            </Form.Item>
        </Form>
    </Modal>
}

export function Editor() {
    let config = useContext(ConfigContext);
    let context = useContext(AppContext);
    let card = context.card;
    if (card == null) return <></>;
    
    let [set_names, set_set_names] = useState<Map<number, string>>(new Map())
    let [dialog, set_dialog] = useState<'image' | 'texts' | 'script' | 'ofuru' | 'metadata' | 'category' | null>(null)
    let [editing_text, set_editing_text] = useState('')

    let [loading_image, set_loading_image] = useState<number | null>(null)
    let [generating_image, set_generating_image] = useState<boolean>(false)
    const loading_image_ref = useRef<number | null>(loading_image)
    let [full_image, set_full_image] = useState<string | null>(null)
    let [center_image, set_center_image] = useState<string | null>(null)
    let [use_full_image, set_use_full_image] = useState(false)

    let is_monster = (card.type & Data.Type.Monster) > 0;
    let is_pendulum = (card.type & Data.Type.Pendulum) > 0;
    let is_xyz = (card.type & Data.Type.Xyz) > 0;
    let is_link = (card.type & Data.Type.Link) > 0;
    
    let send_card_signal = () => { console.log("send signal!"); context.set_context({ ...context, card_signal: !context.card_signal }) }
    let silent_triggers = { onFocus: () => { context.disable_refresh = true }, onBlur: () => { context.disable_refresh = false; send_card_signal() } }
    let is_ex_monster = (card: Card) => card.type & Data.Type.Monster && card.type & EX_TYPES

    const enable_debug = false
    
    useEffect(() => {
    load_strings(config).then(() => {
            let _set_names = new Map<number, string>(transformer.set_names());
            _set_names.set(0, "N/A")
            set_set_names(_set_names)
        })
    }, [config.strings])

    let refresh_image = async (change_to_use_full_image: boolean) => {
        let loading_code = context.card!.code
        enable_debug && console.log("Going to load full image of " + loading_code)
        let a = await current_storage.getItem(`pics/${card.code}.jpg`)
        enable_debug && console.log("loaded full image of card " + loading_code + ", now we're loading " + loading_image_ref.current)
        if (loading_image_ref.current != loading_code) return
        if (a == null) {
            set_full_image(null)
            if (change_to_use_full_image) set_use_full_image(false)
            if (use_full_image) set_loading_image(null)
        }
        else {
            if (typeof a == 'string') set_center_image(a)
            else set_full_image("data:image/jpg;base64, " + btoa(Array.from(new Uint8Array(a as ArrayBuffer)).map(b => String.fromCharCode(b)).join('')))
            if (change_to_use_full_image) set_use_full_image(true)
            if (change_to_use_full_image || use_full_image) set_loading_image(null)
        }
    }

    let refresh_center_image = async (change_to_use_center_image: boolean) => {
        let loading_code = context.card!.code
        enable_debug && console.log("Going to load center image of " + loading_code)
        let a = await current_storage.getItem(`pico/${card.code}.jpg`)
        enable_debug && console.log("loaded center image of card " + loading_code + ", now we're loading " + loading_image_ref.current)
        if (loading_image_ref.current != loading_code) return 
        if (a == null) {
            set_center_image(null)
            if (change_to_use_center_image) set_use_full_image(full_image != null)
            if (!use_full_image) set_loading_image(null)
        }
        else {
            if (typeof a == 'string') set_center_image(a)
            else set_center_image("data:image/jpg;base64, " + btoa(Array.from(new Uint8Array(a as ArrayBuffer)).map(b => String.fromCharCode(b)).join('')))
            if (change_to_use_center_image) set_use_full_image(false)
            if (change_to_use_center_image || !use_full_image) set_loading_image(null)
        }
    }
    
    useEffect(() => { 
        if (context.card == null) return
        set_loading_image(card.code)
        loading_image_ref.current = card.code
        enable_debug && console.log("Going to load card image of " + card.code)
        refresh_image(true)
        refresh_center_image(false)
    }, [context.card?.range?.start, context.package_name]) // start seems to be immortal value.

    useEffect(() => {
        if (document.fonts.status == 'loading')
            wait_font_loading(context)
    }, [])

    let card_image_props: {
        full_frame?: boolean;
        over_frame?: boolean;
        lang: Data.Language;
        desc_scale: number | undefined;
        pdesc_scale: number | undefined;
        zh_cn_style: Data.ZH_CN_Style | undefined;
        card?: Card,
        metas?: any[]
    } = {
        full_frame: false,
        over_frame: false,
        lang: Data.Language.ZH_CN,
        desc_scale: undefined,
        pdesc_scale: undefined,
        zh_cn_style: config.zh_cn_style,
        metas: undefined
    }
    let card_override: Partial<Card> = {}
    let enable_card_proxy = () => {
        if (card_image_props.card != null) return;
        card_image_props.card = new Proxy(card, {
        get(target, prop, receiver) {
            if (prop in card_override) return (card_override as any)[prop];
            return Reflect.get(target, prop, receiver);
        }
    })}
    let remove_newline = config.auto_remove_newline;
    if (card.metas)
        for (let meta of card.metas as string[])
            if (meta === "全框卡") card_image_props.full_frame = true;
            else if (meta === "出框卡") card_image_props.over_frame = true;
            else if (meta === "日语" || meta === "日文") card_image_props.lang = Data.Language.JP;
            else if (meta === "韩语" || meta === "韩文") card_image_props.lang = Data.Language.KR;
            else if (meta === "默认风格" || meta === "自定义1风格" ) card_image_props.zh_cn_style = Data.ZH_CN_Style.Custom1;
            else if (meta === "映蝶风格" || meta === "简体中文风格") card_image_props.zh_cn_style = Data.ZH_CN_Style.YD;
            else if (meta === "ygopro风格" || meta === "自定义2风格") card_image_props.zh_cn_style = Data.ZH_CN_Style.Custom2;
            else if (meta === "翼神龙") card_image_props.metas = [...(card_image_props.metas ?? []), "winged-dragon"];
            else if (meta === "巨神兵") card_image_props.metas = [...(card_image_props.metas ?? []), "tormentor"];
            else if (meta === "天空龙") card_image_props.metas = [...(card_image_props.metas ?? []), "sky-dragon"];
            else if (meta.startsWith("效果缩放")) {
                let scale = parseFloat(meta.substring(5));
                if (!isNaN(scale)) card_image_props.desc_scale = scale;
            }
            else if (meta.startsWith("灵摆缩放")) {
                let scale = parseFloat(meta.substring(5));
                if (!isNaN(scale)) card_image_props.pdesc_scale = scale;
            }
            else if (meta === "自动注音") {
                enable_card_proxy();
                card_override.name = ofuru(card_override.name ?? card.name, config.ofurus);
                card_override.desc = ofuru(card_override.desc ?? card.desc, config.ofurus);
                if (card.pendulum_text) card_override.pendulum_text = ofuru(card_override.pendulum_text ?? card.pendulum_text, config.ofurus);
            }
            else if (meta === "移除回车")
                remove_newline = 'aggressive';
            else if (meta === "移除序号前的回车") 
                remove_newline = 'before_order';
            else if (meta === "保留回车")
                remove_newline = 'off';
            else if (meta.startsWith("替换卡名")) {
                enable_card_proxy();
                card_override.name = meta.substring(4);
            }
    if (remove_newline == 'before_order') {
        const remove_newline_regex = /\n[②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿]/g
        enable_card_proxy();
        card_override.desc = (card_override.desc ?? card.desc).replace(remove_newline_regex, (match) => match.substring(1));
        card_override.pendulum_text = (card_override.pendulum_text ?? card.pendulum_text)?.replace(remove_newline_regex, (match) => match.substring(1));
    }
    else if (remove_newline == 'aggressive') {
        let keep_first_line = (card.type & (Data.Type.Xyz | Data.Type.Synchro | Data.Type.Fusion | Data.Type.Link)) > 0;
        enable_card_proxy();
        card_override.pendulum_text = (card_override.pendulum_text ?? card.pendulum_text)?.replace(/\n/g, '');
        let lines = (card_override.desc ?? card.desc).split('\n');
        if (keep_first_line && lines.length > 0) lines[0] = lines[0] + "\n"
        card_override.desc = lines.join('');
        //card_override.desc = lines.map((line) => line.startsWith('●') ? '\n' + line + '\n' : line).join('').replace(/\n\n/g, "\n");
    }

    return <CardForm className="editor" formValue={card} onValuesChange={send_card_signal}>
        <Row gutter={12} className="panel-container">
            <Col span={12} xs={24} sm={24} md={24} lg={24} xl={12} xxl={12} className="full-width card-image-container" style={use_full_image ? { "textAlign": 'center' } : undefined}>
                <Spin wrapperClassName="card-image-wrapper" spinning={loading_image != null} delay={200}>
                    {
                        use_full_image
                        ? <Image rootClassName="card-image-wrapper" className="card-image" src={full_image ?? ""} />
                        : <CardImage 
                            id="generated-image"
                            extend
                            card={card} 
                            image={center_image} 
                            asset_prefix={import.meta.env.BASE_URL+"assets"} 
                            style={{ height: '100%', margin: 'auto' }} 
                            onClick={() => set_dialog('image') }
                            {...card_image_props}
                />
                }
                </Spin>
            </Col>
            <Col span={12} xs={24} sm={24} md={24} lg={24} xl={12} xxl={12} className='panel'>
                <Line>
                    <FormItem name='name'><Input style={{ textAlign: 'center' }} {...silent_triggers}></Input></FormItem>
                    <FormItem name='code'><InputNumber controls={false} style={{ width: '200px' }} addonBefore='(' addonAfter=')'></InputNumber></FormItem>
                </Line>
                <Line>
                    <FormItem name='prefix_type'><Select2 
                                                    options={(PREFIXES[card.type & 7] ?? []).map((v) => ({ label: v == Data.Type.Normal && is_ex_monster(card) ? '非效果' : TYPE_NAMES.get(v) ?? '通常', value: v }))} 
                                                    fallback={is_ex_monster(card) ? "非效果" : "无副类别" } />
                    </FormItem>
                    <FormItem name='main_type'><Select2 options={[1, 2, 4].map((i) => ({ label: TYPE_NAMES.get(i)!, value: i }))} fallback="无类别" /></FormItem>
                </Line>
                <Line>
                    <FormItem name='attribute'><Select2 disabled={!is_monster} style={{ width: '60px' }} options={transform_map_to_options(ATTRIBUTE_NAMES)} /></FormItem>
                    <FormItem name='level'><InputNumber max={13} disabled={!is_monster} style={{ width: '180px' }} addonAfter={is_link ? undefined : is_xyz ? '阶' : '星'} addonBefore={is_link ? 'LINK-' : undefined}></InputNumber></FormItem>
                    <FormItem name='race'><Select2 disabled={!is_monster} style={{ width: '100px' }} popupMatchSelectWidth={180} options={transform_map_to_options(RACE_NAMES)} /></FormItem>
                    <FormItem name="sub_type">
                        <Select2 disabled={!is_monster} style={{ width: '100%' }} allowClear className="subtype" mode="multiple" placeholder='无额外类别' options={Array.from(SUB_TYPE_OPTIONS.values())} tagRender={(props) => {
                            return <span>{props.label}</span>
                        }} />
                    </FormItem>
                    <FormItem name='attack'><InputNumber disabled={!is_monster} style={{ width: '120px' }}></InputNumber></FormItem>
                    { is_link ? null : <FormItem name='defense'><InputNumber disabled={!is_monster} style={{ width: '120px' }}></InputNumber></FormItem> }
                </Line>
                {is_link ? <Line><FormItem name='linkmarker'><LinkMarkerEditor /></FormItem></Line> : null }
                <Line>
                    <Input className="disappear-input" style={{ width: '60px' }} addonBefore="系列：" />
                    <FormItem name='setcode1'><Select2 allowClear popupMatchSelectWidth={180} options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode2'><Select2 allowClear popupMatchSelectWidth={180} options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode3'><Select2 allowClear popupMatchSelectWidth={180} options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode4'><Select2 allowClear popupMatchSelectWidth={180} options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                </Line>
                <Line>
                    <Dropdown menu={{
                        items: [
                            {
                                key: 'metadata',
                                label: '元信息',
                                onClick: () => { set_dialog('metadata') }
                            }, {
                                key: 'category',
                                label: '效果分类',
                                onClick: () => { set_dialog('category') }
                            }
                        ]
                    }}>
                        <Button onClick={() => { set_editing_text(card.texts.join("\n")); set_dialog('texts')} }>提示文本</Button>
                    </Dropdown>
                    <Dropdown menu={{
                        items: [
                            {
                                key: 'upload',
                                label: <Upload beforeUpload={(file) => { upload_full_image(file, card.code).then(() => refresh_image(true)); return Upload.LIST_IGNORE; }}>上传</Upload>,
                                icon: <AiOutlineUpload />
                            },
                            {
                                key: 'download',
                                label: '下载',
                                icon: <AiOutlineDownload />,
                                onClick: () => download(card.code + ".jpg", full_image!)
                            },
                            {
                                key: 'remove',
                                label: '删除',
                                icon: <AiOutlineDelete />,
                                onClick: () => delete_full_image(card.code).then(() => refresh_image(true))
                            }
                        ]}} disabled={full_image == null}><Button type={use_full_image ? 'primary' : undefined} onClick={() => set_use_full_image(true)}>卡图</Button></Dropdown>
                    <Dropdown menu={{
                            items: [{
                                key: 'upload',
                                label: <ImgCrop rotationSlider aspectSlider showReset modalOk="确认" modalCancel="取消">
                                            <Upload beforeUpload={(file) => { upload_center_image(file, card.code).then(() => refresh_center_image(true)); return Upload.LIST_IGNORE; }}>上传</Upload>
                                        </ImgCrop>,
                                icon: <AiOutlineUpload />
                            },
                            {
                                key: 'download',
                                label: '下载',
                                icon: <AiOutlineDownload />,
                                disabled: center_image == null,
                                onClick: () => download(card.code + ".jpg", center_image!)
                            },
                            {
                                key: 'generate',
                                label: '生成全图',
                                icon: <AiOutlineContainer />,
                                disabled: center_image == null,
                                onClick: () => {(async () => {
                                    set_generating_image(true);
                                    await sleep(500)
                                    await generate_image(card.code, config.image);
                                    set_generating_image(false);
                                    refresh_image(true)
                                })()}
                            },
                            {
                                key: 'remove',
                                label: '删除',
                                icon: <AiOutlineDelete />,
                                disabled: center_image == null,
                                onClick: () => delete_center_image(card.code).then(() => refresh_center_image(true))
                            }]
                    }}><Button type={use_full_image ? undefined : 'primary'} onClick={() => set_use_full_image(false)}>中心图</Button></Dropdown>
                    <Button onClick={() => { 
                        current_storage.getItem(`script/c${card.code}.lua`).then((s) => {
                            let str = s as string
                            if (str == null || str.trim().length === 0) 
                                str = DEFAULT_SCRIPT.replace("{CODE}", card.code.toString()).replace("{NAME}", card.name)
                            set_editing_text(str); 
                            set_dialog('script') 
                        }) }}>脚本</Button>
                </Line>
            </Col>
        </Row>
        {is_pendulum ? 
            <Row gutter={6} style={{ paddingTop: "20px", height: '25%', width: '100%' }}>
                <Space.Compact style={{ width: '100%', height: '100%', paddingBottom: '20px' }}>
                    <FormItem name="left_scale"><InputNumber className="pendulum-scale pendulum-scale-left" controls={false} addonBefore="←"></InputNumber></FormItem>
                    <FormItem name="pendulum_text"><Input.TextArea className="pendulum-text" {...silent_triggers} /></FormItem>
                    <FormItem name="right_scale"><InputNumber className="pendulum-scale pendulum-scale-right" controls={false} addonAfter="→"></InputNumber></FormItem>
                </Space.Compact>
            </Row>
        : null}
        <Row gutter={is_pendulum ? 6 : 12} className={`desc-container`} style={{ paddingTop: "20px", height: is_pendulum ? '25%' : '50%', width: '100%' }}>
            <FormItem name='desc' className="description"><Input.TextArea {...silent_triggers} /></FormItem>
        </Row>
        <Modal open={dialog == 'image'} onCancel={() => set_dialog(null)} footer={null} width={1434} height={2071} closable={false} destroyOnHidden>
            <CardImage id="full-card" extend card={card} image={center_image} asset_prefix={import.meta.env.BASE_URL + "assets"} style={{ width: '1394px',height: '2031px' }} {...card_image_props} />
            <Flex className="full-width full-card-generate-container">
                { center_image && <Button id="full-card-generate" onClick={() => { 
                    generate_image(card.code, config.image).then(() => {
                        set_dialog(null)
                        refresh_image(true)
                });}}>生成全图</Button> }
            </Flex>
        </Modal>
        <Modal open={generating_image && config.image.large_image} footer={null} title={null} closable={false} width={1394*config.image.scale+50} height={2031*config.image.scale+50} destroyOnHidden>
            <Spin spinning={generating_image} tip="正在生成全图，请稍候..." >
                <CardImage id="full-card" extend card={card} image={center_image} asset_prefix={import.meta.env.BASE_URL + "assets"} style={{ width: `${1394*config.image.scale}px`,height: `${2031*config.image.scale}px` }} {...card_image_props} />
            </Spin>
        </Modal>
        <Modal open={dialog == 'texts'} footer={null} title={`编辑 ${card.name}(${card.code}) 提示文本`} closable={false} destroyOnHidden 
            onCancel={() => { card.texts = editing_text.trim().length === 0 ? [] : editing_text.split("\n"); send_card_signal(); set_dialog(null) }} >
            <Input.TextArea style={{ height: '600px' }} defaultValue={editing_text} onChange={(e) => set_editing_text((e.target as any).value)} />
        </Modal>
        <Modal open={dialog == 'script'} footer={null} className="script-modal" closable={false} width="100%" style={{ maxWidth: '1400px' }} destroyOnHidden
            onCancel={() => {
                let lua_path = `script/c${card.code}.lua`
                if (editing_text === "")
                    current_storage.removeItem(lua_path)
                current_storage.setItem(lua_path, editing_text); 
                set_dialog(null) 
            }}>
            {card.range && <Collapse ghost items={[{ 
                label: <Typography.Title level={4}>编辑 {card.name}({card.code}) 卡片脚本</Typography.Title>, 
                children: <Typography.Paragraph>{context.text.slice(card.range.start, card.range.end)}</Typography.Paragraph>
            }]} />}
            <div id="script" style={{ width: '100%', height: '70vh', maxHeight: '1200px' }}>
                <MonacoEditor
                    language="lua"
                    theme={config.isDark ? "vs-dark" : "vs"}
                    defaultValue={editing_text}
                    onChange={(value) => set_editing_text(value ?? "")}
                    loading={<Spin />}
                    options={{
                        fontSize: 14,
                        lineHeight: 19,
                        tabSize: 2,
                        rulers: [80],
                        lineNumbers: "on",
                        renderLineHighlight: "line",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            {/*<Input.TextArea style={{ height: '80vw', maxHeight: '900px' }} placeholder={"脚本未创建..."} defaultValue={editing_text} onChange={(e) => set_editing_text((e.target as any).value)} />*/}
        </Modal>
        <MetadataModal open={dialog == 'metadata'} card={card} onCancel={() => { send_card_signal(); set_dialog(null); }} />
        <Modal open={dialog == 'category'} footer={null} title={`编辑 ${card.name}(${card.code}) 效果分类`} closable={false} width="300px" destroyOnHidden onCancel={() => set_dialog(null)}>
            <Flex vertical gap={4}>
                {Array.from(CATEGORY_NAMES.entries()).map(([bit, name]) => (
                    <Checkbox key={bit}checked={Boolean(Number(card.category) & bit)}
                        onChange={() => {
                            let new_category = Number(card.category) ^ bit;
                            card.category = BigInt(new_category);
                            send_card_signal();
                        }}>
                        {name}
                    </Checkbox>
                ))}
            </Flex>
        </Modal>
    </CardForm>
}

function read_as_buffer(file: File) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file)
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            let result = reader.result as ArrayBuffer | null;
            if (result == null) reject()
            else resolve(result)
        }
    })
}

async function upload_full_image(file: File, code: number) {
    let buf = await read_as_buffer(file);
    await current_storage.setItem(`pics/${code}.jpg`, buf)
}

async function upload_center_image(file: File, code: number) {
    let buf = await read_as_buffer(file);
    await current_storage.setItem(`pico/${code}.jpg`, buf)
}

function delete_full_image(code: number) {
    return current_storage.removeItem(`pics/${code}.jpg`)
}

function delete_center_image(code: number) {
    return current_storage.removeItem(`pico/${code}.jpg`)
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function generate_image(code: number, config: ImageConfig) {
    let div = document.getElementById(config.large_image ? 'full-card' : 'generated-image');
    if (div == null) {
        Modal.warn({ content: '请先切换至中心图模式再进行生成。' })
        return
    }
    div = div.firstElementChild as HTMLElement
    
    if (config.render_engine == 'html2canvas') {
        let canvas = await html2canvas(div, { backgroundColor: 'transparent' });
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob == null) { reject(); return }
                blob.arrayBuffer().then(buffer => current_storage.setItem(`pics/${code}.jpg`, buffer)).then(() => resolve(undefined))
            }, "image/jpeg", 0.95)
        })
    }
    else {
        let s = await domtoimage.toJpeg(div, { quality: 0.95 });
        let blob = b64_to_blob(s);
        return new Promise((resolve, reject) => {
            if (blob == null) { reject(); return }
            blob.arrayBuffer().then(buffer => current_storage.setItem(`pics/${code}.jpg`, buffer)).then(() => resolve(undefined))
        })
    }
}

// https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
function b64_to_blob(dataURI: string) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: 'image/jpeg' });
}

function download(filename: string, image: string) {
    let link = document.createElement('a');
    link.download = filename
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function wait_font_loading(context: Context) {
    // context.set_context({ ...context, loading: '正在载入字体...' })
    // await document.fonts.ready;
    context.set_context({ ...context, loading: undefined });
}
