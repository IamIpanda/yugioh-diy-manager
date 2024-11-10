
import { cloneElement } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { createContext, HTMLProps, ReactElement } from "preact/compat";
import { Select, InputNumber, Input, Space, SelectProps, Row, Col, GetProps, Modal, Button, Upload, Dropdown } from 'antd'
import { Card as CardImage, Data } from "yugioh-card-react";
import * as transformer from "cdb-transformer";

import { AppContext, ConfigContext } from "./model/context";
import { ATTRIBUTE_NAMES, Card, LINKER_NAMES, PREFIXES, RACE_NAMES, SUB_TYPES, TYPE_NAMES } from "./model/card";

import "./editor.css"
import html2canvas from "html2canvas";
import { current_storage } from "./model/storage";
import { AiOutlineContainer, AiOutlineDelete, AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
const SUB_TYPE_OPTIONS = new Map(Array.from(TYPE_NAMES).filter((p) => p[0] != 0 && (p[0] & SUB_TYPES) > 0).map((p) => [p[0], { label: p[1], value: p[0] }]))

function transform_map_to_options(map: Map<number, string>) {
    return Array.from(map.entries()).map((v) => ({ label: v[1], value: v[0] }))
}

function Line(props: GetProps<typeof Space.Compact>) {
    return <Space.Compact {...props} style={{ 'width': '100%', paddingBottom: '20px', justifyContent: 'center' }}>{props.children}</Space.Compact>
}

function Select2(props: SelectProps) {
    return <Select showSearch filterOption={(input, option) => option?.label == null ? false : option.label.toString().indexOf(input)>0} style={{ width: '100%' }} {...props} />
}

function LinkMarkerEditor(props: { onChange?: (value: number) => void } & Omit<HTMLProps<HTMLDivElement>, 'onChange'>) {
    const { value, onChange, ...p } = props;
    const keys = [
        [Data.Linkmarker.TopLeft,    Data.Linkmarker.Top,    Data.Linkmarker.TopRight],
        [Data.Linkmarker.Left,       16,                     Data.Linkmarker.Right],
        [Data.Linkmarker.BottomLeft, Data.Linkmarker.Bottom, Data.Linkmarker.BottomRight]
    ]
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
        let next_value = e
        if (e.target) next_value = e.target.value
        card[props.name] = next_value
        fuck(!react_function_component)
        form.hooks['onValuesChange']?.call(null, next_value)
    } })
}

function Form(props: { formValue: any, onValuesChange?: () => void } & HTMLProps<HTMLDivElement>) {
    return <FormContext.Provider value={{ value: props.formValue, hooks: { onValuesChange: props.onValuesChange } }}>
        <div {...props}>{props.children}</div>
    </FormContext.Provider>
}

export function Editor() {
    let config = useContext(ConfigContext);
    let context = useContext(AppContext);
    let card = context.card;
    if (card == null) return <></>;
    
    let [set_names, set_set_names] = useState<Map<number, string>>(new Map())
    let [dialog, set_dialog] = useState<'image' | 'texts' | 'script' | null>(null)
    let [editing_text, set_editing_text] = useState('')
    let [full_image, set_full_image] = useState<string | null>(null)
    let [center_image, set_center_image] = useState<string | null>(null)
    let [use_full_image, set_use_full_image] = useState(false)

    let is_monster = (card.type & Data.Type.Monster) > 0;
    let is_pendulum = (card.type & Data.Type.Pendulum) > 0;
    let is_xyz = (card.type & Data.Type.Xyz) > 0;
    let is_link = (card.type & Data.Type.Link) > 0;
    
    let send_card_signal = () => { context.set_context({ ...context, card_signal: !context.card_signal }) }
    let silent_triggers = { onFocus: () => { context.disable_refresh = true }, onblur: () => { context.disable_refresh = false } }
    
    useEffect(() => {
        transformer.set_string_conf(config.strings)
        let _set_names = new Map<number, string>(transformer.set_names());
        _set_names.set(0, "N/A")
        set_set_names(_set_names)
    }, [config.strings])

    let refresh_image = (update: boolean) => current_storage.getItem(`pics/${card.code}.jpg`).then((a) => {
        if (a == null) {
            set_full_image(null)
            if(update) set_use_full_image(false)
        }
        else {
            if (typeof a == 'string')
                set_center_image(a)
            else
                set_full_image("data:image/jpg;base64, " + btoa(Array.from(new Uint8Array(a as ArrayBuffer)).map(b => String.fromCharCode(b)).join('')))
            if(update) set_use_full_image(true)
        }
    })

    let refresh_center_image = (update: boolean) => current_storage.getItem(`pico/${card.code}.jpg`).then((a) => {
        if (a == null) {
            set_center_image(null)
            if (update) set_use_full_image(full_image != null)
        }
        else {
            if (typeof a == 'string')
                set_center_image(a)
            else
                set_center_image("data:image/jpg;base64, " + btoa(Array.from(new Uint8Array(a as ArrayBuffer)).map(b => String.fromCharCode(b)).join('')))
            if (update) set_use_full_image(false)
        }
    })

    useEffect(() => { 
        refresh_image(true)
        refresh_center_image(false)
    }, [context.card.range?.start, context.package_name]) // start seems to be immortal value.

    return <Form className="editor" formValue={card} onValuesChange={send_card_signal}>
        <Row span={12} style={{ height: '50%' }}>
            <Col span={12} xs={24} sm={24} md={24} lg={24} xl={12} xxl={12} className="full" style={use_full_image ? { "textAlign": 'center' } : undefined}>
            {
                use_full_image ? <img class="card-image" src={full_image ?? ""} />
                : <CardImage id="generated-image" card={card} image={center_image} lang={Data.Language.ZH_CN} asset_prefix={import.meta.env.BASE_URL+"assets"} style={{ height: '100%', margin: 'auto' }} onClick={() => set_dialog('image') } />
            }
            </Col>
            <Col span={12} xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                <Line>
                    <FormItem name='name'><Input style={{ textAlign: 'center' }} {...silent_triggers}></Input></FormItem>
                    <FormItem name='code'><InputNumber controls={false} style={{ width: '200px' }} addonBefore='(' addonAfter=')'></InputNumber></FormItem>
                </Line>
                <Line>
                <FormItem name='prefix_type'><Select2 options={(PREFIXES[card.type & 7] ?? []).map((v) => ({ label: TYPE_NAMES.get(v) ?? '通常', value: v }))} /></FormItem>
                    <FormItem name='main_type'><Select2 options={[1, 2, 4].map((i) => ({ label: TYPE_NAMES.get(i)!, value: i }))} /></FormItem>
                </Line>
                <Line>
                    <FormItem name='attribute'><Select2 disabled={!is_monster} style={{ width: '60px' }} options={transform_map_to_options(ATTRIBUTE_NAMES)} /></FormItem>
                    <FormItem name='level'><InputNumber disabled={!is_monster} style={{ width: '180px' }} addonAfter={is_link ? undefined : is_xyz ? '阶' : '星'} addonBefore={is_link ? 'LINK-' : undefined}></InputNumber></FormItem>
                    <FormItem name='race'><Select2 disabled={!is_monster} style={{ width: '100px' }} options={transform_map_to_options(RACE_NAMES)} /></FormItem>
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
                    <FormItem name='setcode1'><Select2 allowClear options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode2'><Select2 allowClear options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode3'><Select2 allowClear options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                    <FormItem name='setcode4'><Select2 allowClear options={Array.from(set_names.entries()).map((v) => ({ label: v[1], value: v[0] }))} /></FormItem>
                </Line>
                <Line>
                    <Button onClick={() => { set_editing_text(card.texts.join("\n")); set_dialog('texts')} }>提示文本</Button>
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
                                label: <Upload beforeUpload={(file) => { upload_center_image(file, card.code).then(() => refresh_center_image(true)); return Upload.LIST_IGNORE; }}>上传</Upload>,
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
                                onClick: () => generate_image(card.code).then(() => refresh_image(true))
                            },
                            {
                                key: 'remove',
                                label: '删除',
                                icon: <AiOutlineDelete />,
                                disabled: center_image == null,
                                onClick: () => delete_center_image(card.code).then(() => refresh_center_image(true))
                            }]
                    }}><Button type={use_full_image ? undefined : 'primary'} onClick={() => set_use_full_image(false)}>中心图</Button></Dropdown>
                    <Button onClick={() => { current_storage.getItem(`script/c${card.code}.lua`).then((s) => { set_editing_text(s as string); set_dialog('script') }) }}>脚本</Button>
                </Line>
            </Col>
        </Row>
        {is_pendulum ? 
            <Row span={6} style={{ paddingTop: "20px", height: '25%', width: '100%' }}>
                <Space.Compact style={{ width: '100%', height: '100%', paddingBottom: '20px' }}>
                    <FormItem name="lscale"><InputNumber className="pendulum-scale pendulum-scale-left" controls={false} addonBefore="←"></InputNumber></FormItem>
                    <FormItem name="pendulum_text"><Input.TextArea className="pendulum-text" {...silent_triggers} /></FormItem>
                    <FormItem name="rscale"><InputNumber className="pendulum-scale pendulum-scale-right" controls={false} addonAfter="→"></InputNumber></FormItem>
                </Space.Compact>
            </Row>
        : null}
        <Row span={is_pendulum ? 6 : 12} style={{ paddingTop: "20px", height: is_pendulum ? '25%' : '50%', width: '100%' }}>
            <FormItem name='desc' className="description"><Input.TextArea {...silent_triggers} /></FormItem>
        </Row>
        <Modal open={dialog == 'image'} onCancel={() => set_dialog(null)} footer={null} width={1434} height={2071} closable={false}>
            <CardImage id="full-card" card={card} image={center_image} lang={Data.Language.ZH_CN} asset_prefix={import.meta.env.BASE_URL + "assets"} style={{ width: '1394px',height: '2031px' }} />
        </Modal>
        <Modal open={dialog == 'texts'} footer={null} title="提示文本" closable={false} destroyOnClose
            onCancel={() => { card.texts = editing_text.split("\n"); send_card_signal(); set_dialog(null) }} >
            <Input.TextArea style={{ height: '600px' }} defaultValue={editing_text} onChange={(e) => set_editing_text((e.target as any).value)} />
        </Modal>
        <Modal open={dialog == 'script'} footer={null} title="卡片脚本" closable={false} width="100%" style={{ maxWidth: '1400px' }} destroyOnClose
            onCancel={() => {
                let lua_path = `script/c${card.code}.lua`
                if (editing_text === "")
                    current_storage.removeItem(lua_path)
                current_storage.setItem(lua_path, editing_text); 
                set_dialog(null) 
            }}>
            <Input.TextArea style={{ height: '80vw', maxHeight: '900px' }} placeholder={"脚本未创建..."} defaultValue={editing_text} onChange={(e) => set_editing_text((e.target as any).value)} />
        </Modal>
    </Form>
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

async function generate_image(code: number) {
    let div = document.getElementById('generated-image');
    if (div == null) {
        Modal.warn({ content: '请先切换至中心图模式再进行生成。' })
        return
    }
    div = div.childNodes[0] as HTMLElement;
    div.style.transform = "";
    
    let canvas = await html2canvas(div, { backgroundColor: 'transparent' });
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob == null) { reject(); return }
            current_storage.setItem(`pics/${code}.jpg`, blob.arrayBuffer()).then(() => resolve(undefined))
        }, "image/jpeg", 0.8)
    })
}

function download(filename: string, image: string) {
    let link = document.createElement('a');
    link.download = filename
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

