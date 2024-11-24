import { Dispatch, StateUpdater, useContext, useEffect, useRef, useState } from 'preact/hooks'
import { Flex, Modal, Upload, Tooltip, Button, Typography, Space, Input, GetProps, Dropdown, Table, Switch, InputRef, TreeDataNode, Tree } from 'antd';
import { AiOutlineDownload, AiOutlineQuestionCircle, AiOutlineSetting, AiOutlineUpload, AiOutlineFolderOpen, AiOutlineDatabase, AiOutlineDelete, AiOutlineRedo, AiFillCheckCircle, AiOutlineUnorderedList, AiOutlineFolderAdd, AiOutlineFileText } from "react-icons/ai";
import { RiArchiveStackLine } from "react-icons/ri";

import localforage from 'localforage';
import { DEFAULT_PACKAGE_NAME } from './model/default';
import { generate_from_text, transform_not_effect_rules } from './model/card';
import { AppContext, ConfigContext, Context, load_strings, load_context } from './model/context'
import { accept_database, accept_package, current_package_name, current_storage, delete_package, generate_package, load_default_package, package_list, set_package } from './model/storage';

import { html as Doc } from './assets/help.md'
import "./header.css"

const CURRENT_VERSION = 1;
let seen_help = await localforage.getItem("seen_help") as number ?? 0

function HeightSpace(prop: { height: string }) {
    return <div style={{ height: prop.height }} />
}

function SettingsModal(prop: {is_open: boolean, on_close: () => void}) {
    const config = useContext(ConfigContext);
    const [use_package, set_use_package] = useState(false)
    const [internal_strings, set_internal_strings] = useState(config.strings);
    const [package_strings, set_package_strings] = useState("")
    const [not_effect_rules, set_not_effect_rules] = useState("")
    useEffect(() => {
        localforage.getItem("config").then((c) => set_not_effect_rules((c as any ?? {}).not_effect_rules))
        current_storage.getItem("strings.conf").then((c) => set_package_strings(c as string ?? ""))
    }, [prop.is_open])
    const on_close = async () => {
        config.set_config({ ...config, strings: internal_strings, not_effect_rules: transform_not_effect_rules(not_effect_rules)})
        let save_config: any = { ...config, strings: internal_strings, not_effect_rules }
        delete save_config.set_config
        await localforage.setItem("config", save_config)
        if (package_strings.length > 0) 
            await current_storage.setItem("strings.conf", package_strings)
        else 
            await current_storage.removeItem("strings.conf")
        load_strings(config)
        prop.on_close()
    }
    return <Modal open={prop.is_open} title="设置" onCancel={on_close} footer={null}>
                <Tooltip title="字段名列表"><Flex justify='space-between'>
                    <Typography.Text>Strings.conf:</Typography.Text>
                    <Switch checkedChildren="卡包" unCheckedChildren="自带" value={use_package} onChange={(c) => set_use_package(c)} />
                </Flex></Tooltip>
                <HeightSpace height='5px' />
                <Input.TextArea style={{ height: "500px" }} value={use_package ? package_strings : internal_strings} onChange={(e) => {
                    if (use_package) set_package_strings(e.currentTarget.value)
                    else set_internal_strings(e.currentTarget.value)
                }} />
                <HeightSpace height='20px' />
                <Tooltip title="满足匹配条件的行，不会被计入效果。"><Typography.Text>效果排除行:</Typography.Text></Tooltip>
                <HeightSpace height='5px' />
                <Input.TextArea style={{ height: '200px' }} value={not_effect_rules} onChange={(e) => set_not_effect_rules(e.currentTarget.value)} />
            </Modal>
}

function PackageOperator(props: { package_name: string, allow_delete?: boolean, allow_reset?: boolean, callback?: (package_name: string) => void }) {
    return <>
        {props.allow_reset ? <Tooltip title="重置"><Button variant='link' color='danger' icon={<AiOutlineRedo />} 
                                      onClick={(e) => { e.stopPropagation(); delete_package(props.package_name).then(load_default_package).then(props.callback?.bind(null, props.package_name)) }} /></Tooltip> : null }
        {props.allow_delete ? <Tooltip title="删除"><Button variant='link' color='danger' icon={<AiOutlineDelete />} 
                                      onClick={(e) => { e.stopPropagation(); delete_package(props.package_name).then(props.callback?.bind(null, props.package_name)) }} /></Tooltip> : null }
    </>
}

function PackageModal(props: GetProps<typeof Modal>) {
    let context = useContext(AppContext)
    let [packages, set_packages] = useState<string[]>([])
    useEffect(() => { package_list().then(set_packages) }, [props.open])
    let call = async (package_name: string) => {
        await set_package(package_name);
        context.set_context({ ...context, ...(await load_context()) });
        props.onCancel?.call(null, null as any)
    }
    return <Modal title="卡包" footer={null} closable={false} {...props} destroyOnClose>
        <Table
            dataSource={packages}
            pagination={false}
            showHeader={false}
            className='package-table'
            columns={[{ title: '卡包', dataIndex: '', key: '', render: (package_name) => <>{package_name} {context.package_name == package_name ? <AiFillCheckCircle size={18} /> : ''}</> },
            {
                title: '操作', dataIndex: '', key: '', width: 40, render: (package_name) => {
                    return <PackageOperator package_name={package_name}
                        allow_delete={package_name != context.package_name && package_name != DEFAULT_PACKAGE_NAME}
                        allow_reset={package_name === DEFAULT_PACKAGE_NAME}
                        callback={() => package_list().then(set_packages).then(() => { if (package_name === DEFAULT_PACKAGE_NAME && context.package_name == package_name) call(package_name) })} />
                }
            }]}
            onRow={(package_name) => ({
                onClick: () => {
                    call(package_name)
                }
            })}
        />
    </Modal>
}

function NewModal(props: Omit<GetProps<typeof Modal>, 'onOk'> & { onOk?: (n: string) => void }) {
    let { onOk, ...rest_props } = props;
    let input = useRef<InputRef>(null);
    let [name, set_name] = useState("")
    return <Modal title="新建卡包" 
                  closable={false}
                  onOk={() => props.onOk?.call(null, name)} 
                  afterOpenChange={(o) => { if (o) input.current?.focus() }} 
                  cancelButtonProps={{ style: { display: 'none' } }} 
                  okText="确定" 
                  {...rest_props}>
        {/*@ts-ignore*/}
        <Input ref={input} placeholder="在此输入新卡包名" style={{ marginTop: '4px' }} onChange={(e) => set_name(e.currentTarget.value)} />
    </Modal>
}

function FileModal(props: GetProps<typeof Modal>) {
    let context = useContext(AppContext)
    let [nodes, set_nodes] = useState<TreeDataNode[]>([])
    useEffect(() => { file_tree(context.package_name).then(set_nodes) }, [props.open])
    return <Modal title="文件" closable={false} footer={null} {...props}>
        <Tree defaultExpandedKeys={['root']} treeData={nodes} height={800} />
    </Modal>
}


function HelpModal(props: GetProps<typeof Modal>) {
    return <Modal title={null} footer={null} closable={false} {...props}>
        <Typography dangerouslySetInnerHTML={{ __html: Doc.replace("{{BUILD_DATE}}", BUILD_DATE).replace("{{PACKAGE_VERSION}}",PACKAGE_VERSION) }} />
    </Modal>
}

function UploadWrapper(props: GetProps<typeof Upload>) {
    let context = useContext(AppContext)
    const callback = async (filename: string, content: ArrayBuffer | string) => {
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
            await accept_package(filename, content as ArrayBuffer, (index, total, filename) => {
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

function PackageMenu(package_name: string, filename: string, set_dialog: Dispatch<StateUpdater<string | null>>) {
    return [{
        key: 'current-package',
        label: <div><Typography>当前卡包：<Typography.Text code>{package_name}</Typography.Text></Typography></div>,
        disabled: true
    },{
        key: 'current-file',
        label: <div><Typography>当前数据库：<Typography.Text code>{filename}</Typography.Text></Typography></div>,
        disabled: true
    },{
        key: 'new',
        label: '新建卡包',
        icon: <AiOutlineFolderAdd />,
        onClick: () => set_dialog('new')
    }, {
        key: 'menu',
        label: '卡包列表',
        icon: <AiOutlineUnorderedList />,
        onClick: () => set_dialog('package')
    }, {
        key: 'files',
        label: '文件管理',
        icon: <AiOutlineFileText />,
        onClick: () => set_dialog('files')
    }]
}

function upload_file(callback: (filename: string, result: ArrayBuffer | string) => void, file: File) {
    let filename = file.name;
    let reader = new FileReader()
    reader.addEventListener('load', (e) => {
        if (e.target == null || e.target.result == null || typeof e.target.result === 'string')
            return
        callback(filename, e.target.result as ArrayBuffer | string)
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

async function new_package(context: Context, name: string) {
    await set_package(name)
    await current_storage.setItem(name + ".cdb", "")
    context.set_context({ ...context, package_name: name, filename: name + ".cdb", text: "", cards: [], card: undefined })
}

async function file_tree(name: string): Promise<TreeDataNode[]> {
    let files = await current_storage.keys()
    let root_node: TreeDataNode = { key: 'root', title: name, children: [] }
    for (let full_filename of files) {
        if (full_filename == 'name') continue;
        let current_node = root_node
        let current_path = ''
        let paths = full_filename.split("/")
        let filename = paths.pop()
        for (let path of paths) {
            if (current_node.children == null) current_node.children = []
            current_path = current_path + (current_path === '' ? '' : '/') + path
            let next_node = current_node.children!.find((n) => n.key === current_path) 
            if (next_node == null) {
                next_node = { key: current_path, title: path }
                current_node.children.push(next_node)
            }
            current_node = next_node
        }
        if (current_node.children == null) current_node.children = []
        current_node.children!.push({ key: full_filename, title: filename })
    }
    return [root_node]
}

export function Header() {
    const context = useContext(AppContext)
    const [dialog, set_dialog] = useState<string | null>(CURRENT_VERSION > seen_help ? 'help' : null)
    return <Flex justify="space-between" className="header full">
        <Flex>
            <RiArchiveStackLine size="24" />
            <Typography.Title className="title" level={4}>卡包编辑器</Typography.Title>
        </Flex>
        <Space>
            <Tooltip title='上传并新建'><UploadWrapper><Button aria-label='upload' variant='link' icon={<AiOutlineUpload />} /></UploadWrapper></Tooltip>
            <Dropdown menu={{ items: DownloadMenu() }}><Button aria-label='download' variant='link' icon={<AiOutlineDownload />} /></Dropdown>
            <Dropdown menu={{ items: PackageMenu(context.package_name, context.filename, set_dialog) }}><Button aria-label='packages' variant='link' onClick={() => set_dialog("package")} icon={<AiOutlineFolderOpen />}></Button></Dropdown>
            <Tooltip title='帮助'><Button aria-label='help' variant='link' onClick={() => set_dialog("help")} icon={<AiOutlineQuestionCircle />} /></Tooltip>
            <Tooltip title='设置'><Button aria-label='settings' variant='link' onClick={() => set_dialog("settings")} icon={<AiOutlineSetting />} /></Tooltip >
            <SettingsModal is_open={dialog == 'settings'} on_close={() => { set_dialog(null) }} />
            <PackageModal open={ dialog == 'package' } onCancel={() => { set_dialog(null) } } />
            <HelpModal open={dialog == 'help'} width={1000} height={800} onCancel={() => { set_dialog(null); localforage.setItem("seen_help", CURRENT_VERSION)}} />
            <NewModal open={dialog == 'new'} onCancel={() => set_dialog(null)} onOk={(n) => new_package(context, n).then(() => set_dialog(null))} />
            <FileModal open={dialog == 'files'} onCancel={() => set_dialog(null)} />
        </Space>
    </Flex>
}
