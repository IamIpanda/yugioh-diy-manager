import { useContext, useEffect, useState } from 'preact/hooks'
import { Flex, Modal, Upload, Tooltip, Button, Typography, Space, Input, GetProps, Dropdown, Table } from 'antd';
import { AiOutlineDownload, AiOutlineQuestionCircle, AiOutlineSetting, AiOutlineUpload, AiOutlineFolderOpen, AiOutlineDatabase, AiOutlineDelete, AiOutlineRedo } from "react-icons/ai";
import { RiArchiveStackLine } from "react-icons/ri";

import localforage from 'localforage';
import { accept_database, accept_package, current_package_name, delete_package, generate_package, load_default_package, package_list, set_package } from './model/storage';
import { AppContext, ConfigContext, Context, load_context } from './model/context'
import { generate_from_text, transform_not_effect_rules } from './model/card';
import "./header.css"
import { DEFAULT_PACKAGE_NAME } from './model/default';

const CURRENT_VERSION = 1;
let seen_help = await localforage.getItem("seen_help") as number ?? 0

function HeightSpace(prop: { height: string }) {
    return <div style={{ height: prop.height }} />
}

function SettingsModal(prop: {is_open: boolean, on_close: () => void}) {
    const config = useContext(ConfigContext);
    const [strings, set_strings] = useState(config.strings);
    const [not_effect_rules, set_not_effect_rules] = useState(localStorage.getItem('not_effect') ?? "")
    const on_close = () => {
        config.set_config!({...config, strings: strings, not_effect_rules: transform_not_effect_rules(not_effect_rules)})
        localStorage.setItem('not_effect', not_effect_rules)
        prop.on_close()
    }
    return <Modal open={prop.is_open} title="设置" onCancel={on_close} footer={null}>
                <Tooltip title="字段名列表"><Typography.Text>Strings.conf:</Typography.Text></Tooltip>
                <HeightSpace height='5px' />
                <Input.TextArea style={{ height: "500px" }} value={strings} onChange={(e) => set_strings(e.currentTarget.value)} />
                <HeightSpace height='20px' />
                <Tooltip title="满足匹配条件的行，不会被计入效果。"><Typography.Text>效果排除行:</Typography.Text></Tooltip>
                <HeightSpace height='5px' />
                <Input.TextArea style={{ height: '200px' }} value={not_effect_rules} onChange={(e) => set_not_effect_rules(e.currentTarget.value)} />
            </Modal>
}

function UploadWrapper(props: GetProps<typeof Upload>) {
    let context = useContext(AppContext)
    const callback = async (filename: string, content: ArrayBuffer) => {
        context.set_context({...context, loading: `正在载入 ${filename}...`})
        if (filename.endsWith(".cdb")) {
            await accept_database(filename, content)
            context.set_context({ ...context, ...(await load_context()), loading: undefined })
        }
        else if (filename.endsWith('.ypk') || filename.endsWith('.zip')) {
            let current_index = 0, current_total = -1, current_filename = '';
            let n = setInterval(() => {
                if (current_total > 0)
                    context.set_context({ ...context, loading: `正在载入 (${current_index + 1}/${current_total}, ${current_filename})...` })
            }, 300)
            await accept_package(filename, content, (index, total, filename) => {
                current_index = index;
                current_total = total;
                current_filename = filename;
            })
            clearInterval(n)
            context.set_context({ ...context, ...(await load_context()), loading: undefined })
        }
        else
            Modal.warning({ content: "无法辨认的扩展名。" })
    }
    return <Upload accept='.cdb,.txt,.zip,.ypk' beforeUpload={upload_file.bind(null, callback)} {...props} />
}

function DownloadMenu() {
    let context = useContext(AppContext)
    return [{
        key: 'package',
        label: <div>下载卡包（.ypk）</div>,
        icon: <RiArchiveStackLine />,
        onClick: () => {
            context.set_context({ ...context, loading: "正在生成卡包..." })
            download_package(context).then(() => context.set_context({ ...context, loading: undefined }))
        }
    }, {
        key: 'database',
        label: <div>下载数据库（.cdb）</div>,
        icon: <AiOutlineDatabase />,
        onClick: () => download_database(context.text)
    }]
}

function PackageOperator(props: { package_name: string, allow_delete?: boolean, allow_reset?: boolean, callback?: () => void }) {
    return <>
        {props.allow_reset ? <Tooltip title="重置"><Button variant='link' color='danger' icon={<AiOutlineRedo />} 
                                      onClick={(e) => { e.stopPropagation(); delete_package(props.package_name).then(load_default_package).then(props.callback) }} /></Tooltip> : null }
        {props.allow_delete ? <Tooltip title="删除"><Button variant='link' color='danger' icon={<AiOutlineDelete />} 
                                      onClick={(e) => { e.stopPropagation(); delete_package(props.package_name).then(props.callback) }} /></Tooltip> : null }
    </>
}

function PackageModal(props: GetProps<typeof Modal>) {
    let context = useContext(AppContext)
    let [packages, set_packages] = useState<string[]>([])
    useEffect(() => { package_list().then((l) => set_packages(l)) }, [])
    return <Modal title="卡包" footer={null} closable={false} {...props} destroyOnClose>
        <Table 
            dataSource={packages} 
            pagination={false} 
            showHeader={false}
            size="small"
            columns={[{ title: '卡包', dataIndex: '', key: '' }, 
                      { title: '操作', dataIndex: '', key: '', width: 40, render: (package_name) => {
                        return <PackageOperator package_name={package_name} 
                                                allow_delete={package_name != context.package_name && package_name != DEFAULT_PACKAGE_NAME} 
                                                allow_reset={package_name === DEFAULT_PACKAGE_NAME}
                                                callback={() => package_list().then(set_packages)} /> 
            }}]}
            onRow={(package_name) => ({ onClick: () => { 
                let call = async () => {
                    await set_package(package_name); 
                    context.set_context({...context, ...(await load_context())});
                    props.onCancel?.call(null, null as any)
                }
                call()
            }})}
        />
    </Modal>
}

function HelpModal(props: GetProps<typeof Modal>) {
    return <Modal title={null} footer={null} closable={false} {...props}>
        <Typography>
            <Typography.Title level={2}>卡包编辑器</Typography.Title>
            <Typography.Paragraph>此页面意在随时随地编辑适用于<Typography.Text code>ygopro</Typography.Text>的数据库和卡包。</Typography.Paragraph>
            <blockquote>在一切开始之前，请记住：此页面是一个<b>纯前端服务</b>。你的所有数据都以<Typography.Text code>IndexedDB</Typography.Text>形式保存在本地浏览器，没有任何数据实际上传至服务器，页面上的「上传」与「下载」仅为方便理解。</blockquote>
            <Typography.Paragraph>所有卡片以文本形式记录，格式参考自知名翻译作者<b>XYZ龙加农</b>的卡片格式。</Typography.Paragraph>
            <Typography.Paragraph>剩下的事情鸽了，谁没事写文档</Typography.Paragraph>
        </Typography>
    </Modal>
}

function upload_file(callback: (filename: string, result: ArrayBuffer) => void, file: File) {
    let filename = file.name;
    let reader = new FileReader()
    reader.addEventListener('load', (e) => {
        if (e.target == null || e.target.result == null || typeof e.target.result === 'string')
            return
        callback(filename, e.target.result as ArrayBuffer)
    });
    reader.readAsArrayBuffer(file) 
    return Upload.LIST_IGNORE
}


async function download_database(text: string) {
    let arr = generate_from_text(text);
    let blob = new Blob([arr], {type: "application/x-sqlite3"});
    let package_name = await current_package_name() ?? "MyDIY" 
    download(package_name + ".cdb", blob)
}

async function download_package(context: Context) {
    let current_index = 0, current_total = -1, current_filename = '';
    let n = setInterval(() => {
        if (current_total > 0) 
            context.set_context({ ...context, loading: `正在生成卡包 (${current_index + 1}/${current_total}, ${current_filename})...` })
    }, 300)
    let blob = await generate_package((index, total, filename) => { 
        current_index = index;
        current_total = total;
        current_filename = filename;
    });
    clearInterval(n)
    let package_name = await current_package_name() ?? "MyDIY"
    download(package_name + ".ypk", blob)
}

function download(filename: string, blob: Blob) {
    let element = document.createElement('a')
    document.body.appendChild(element)
    element.href = window.URL.createObjectURL(blob);
    element.download = filename 
    element.addEventListener('click', () => {
        setTimeout(() => {
            window.URL.revokeObjectURL(element.href);
            element.remove();
        }, 200)
    })
    element.click()
}

export function Header() {
    const context = useContext(AppContext)
    const [dialog, set_dialog] = useState<string | null>(CURRENT_VERSION > seen_help ? 'help' : null)
    return <Flex justify="space-between" className="header full">
        <Flex>
            <RiArchiveStackLine size="24" />
            <Typography.Title level={4}>卡包编辑器</Typography.Title>
        </Flex>
        <Space>
            <Tooltip title='上传'><UploadWrapper><Button aria-label='upload' variant='link' icon={<AiOutlineUpload />} /></UploadWrapper></Tooltip>
            <Dropdown menu={{ items: DownloadMenu() }}><Button aria-label='download' variant='link' icon={<AiOutlineDownload />} /></Dropdown>
            <Tooltip title={`卡包（当前卡包：${context.package_name}）`}><Button aria-label='packages' variant='link' onClick={() => set_dialog("package")} icon={<AiOutlineFolderOpen />}></Button></Tooltip>
            <Tooltip title='帮助'><Button aria-label='help' variant='link' onClick={() => set_dialog("help")} icon={<AiOutlineQuestionCircle />} /></Tooltip>
            <Tooltip title='设置'><Button aria-label='settings' variant='link' onClick={() => set_dialog("settings")} icon={<AiOutlineSetting />} /></Tooltip >
            <SettingsModal is_open={dialog == 'settings'} on_close={() => { set_dialog(null) }} />
            <PackageModal open={ dialog == 'package' } onCancel={() => { set_dialog(null) } } />
            <HelpModal open={dialog == 'help'} width={1000} height={800} onCancel={() => { set_dialog(null); localforage.setItem("seen_help", CURRENT_VERSION)}} />
        </Space>
    </Flex>
}
