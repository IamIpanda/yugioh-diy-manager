import { Dispatch, StateUpdater, useContext, useEffect, useRef, useState } from 'preact/hooks'
import { Flex, Modal, Upload, Tooltip, Button, Typography, Space, Input, GetProps, Dropdown, Table, Switch, InputRef, TreeDataNode, Tree, Form, Spin, Alert, Checkbox } from 'antd';
import { createClient, FileStat, WebDAVClientOptions } from 'webdav'
import { AiOutlineDownload, AiOutlineQuestionCircle, AiOutlineSetting, AiOutlineUpload, AiOutlineFolderOpen, AiOutlineDatabase, AiOutlineDelete, AiOutlineRedo, AiFillCheckCircle, AiOutlineUnorderedList, AiOutlineFolderAdd, AiOutlineFileText, AiOutlineCloudServer } from "react-icons/ai";
import { RiArchiveStackLine, RiDownloadCloud2Line } from "react-icons/ri";
import { VscDebug } from 'react-icons/vsc';

import * as ini from 'ini'
import { format } from 'cdb-transformer';
import localforage from 'localforage';
import { DEFAULT_PACKAGE_NAME } from './model/default';
import { generate_from_text, transform_not_effect_rules } from './model/card';
import { AppContext, ConfigContext, Context, load_strings, load_context } from './model/context'
import { accept_database, accept_package, current_package_name, current_storage, delete_package, dump, generate_package, generate_package_name_from_filename, load_default_package, package_list, set_package, set_text_filename } from './model/storage';

import { html as Doc } from './assets/help.md'
import "./header.css"
import { useForm } from 'antd/es/form/Form';

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
    const [loading_internal_strings, set_loading_internal_strings] = useState(false)
    const [not_effect_rules, set_not_effect_rules] = useState("")
    useEffect(() => {
        localforage.getItem("config").then((c) => set_not_effect_rules((c as any ?? {}).not_effect_rules))
        current_storage.getItem("strings.conf").then((c) => set_package_strings(c as string ?? ""), () => set_package_strings(""))
    }, [prop.is_open])
    const on_close = async () => {
        config.set_config({ ...config, strings: internal_strings, not_effect_rules: transform_not_effect_rules(not_effect_rules)})
        let save_config: any = { ...config, strings: internal_strings, not_effect_rules }
        delete save_config.set_config
        await localforage.setItem("config", save_config)
        try {
            if (package_strings.length > 0) 
                await current_storage.setItem("strings.conf", package_strings)
            else
                await current_storage.removeItem("strings.conf")
        }
        catch {}
        load_strings(config)
        prop.on_close()
    }
    const on_update = async () => {
        set_loading_internal_strings(true)
        try {
            let text = await fetch('https://raw.githubusercontent.com/Fluorohydride/ygopro/refs/heads/master/strings.conf').then((r) => r.text())
            let new_internal_strings = text.split("\n").filter((s) => s.startsWith("!setname")).join("\n")
            set_internal_strings(new_internal_strings)
        }
        catch(e) {
            console.error(e)
        }
        set_loading_internal_strings(false)
    }
    return <Modal open={prop.is_open} title="设置" className='modal-settings' onCancel={on_close} footer={null}>
                <Flex justify='space-between'>
                    <Tooltip title="字段名列表"><Typography.Text>Strings.conf:</Typography.Text></Tooltip>
                    <Flex gap="small">
                        {!use_package && <Tooltip title="从远端下载最新字段名列表"><Button icon={<RiDownloadCloud2Line />} variant='link' size='small' onClick={on_update} disabled={loading_internal_strings} /></Tooltip>}
                        <Switch checkedChildren="卡包" unCheckedChildren="自带" value={use_package} onChange={(c) => set_use_package(c)} />
                    </Flex>
                </Flex>
                <HeightSpace height='5px' />
                <Input.TextArea style={{ height: "500px" }} value={use_package ? package_strings : internal_strings} disabled={loading_internal_strings} onChange={(e) => {
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

function PackagesModal(props: GetProps<typeof Modal>) {
    let context = useContext(AppContext)
    let [packages, set_packages] = useState<string[]>([])
    let update_packages = () => package_list().then((r) => set_packages(Object.keys(r)))
    useEffect(() => { update_packages() }, [props.open])
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
                        callback={() => update_packages().then(() => { if (package_name === DEFAULT_PACKAGE_NAME && context.package_name == package_name) call(package_name) })} />
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
                  afterOpenChange={(o) => { if (o) input.current?.select() }} 
                  cancelButtonProps={{ style: { display: 'none' } }} 
                  okText="确定" 
                  {...rest_props}>
        {/*@ts-ignore*/}
        <Input ref={input} placeholder="在此输入新卡包名" style={{ marginTop: '4px' }} onChange={(e) => set_name(e.currentTarget.value)} />
    </Modal>
}

type DavModalForm = {
    url: string,
    username?: string,
    password?: string,
    basepath?: string,

}
function OpenDavModal(props: Omit<GetProps<typeof Modal>, 'onOk'> & { onOk: (name: string, config: { driver: string, url: string, options: WebDAVClientOptions }) => void}) {
    let { onOk, ...rest_props } = props;
    let [loading, set_loading] = useState<boolean>(false)
    let [last_eror, set_last_error] = useState<string | null>(null)
    let [nodes, set_nodes] = useState<TreeDataNode[]>([])
    let [node_map, set_node_map] = useState<Record<string, TreeDataNode>>({})
    let [form] = Form.useForm()
    const make_client = () => {
        let data: DavModalForm = form.getFieldsValue(true);
        let {url, ...options} = data
        return createClient(url, options)
    }
    const fetch_nodes = async (path?: string) => {
        if (path == null) path = "/"
        let parent_node = node_map[path]
        if (parent_node == null && path !== "/") return false
        let client = make_client()
        set_loading(true)
        let result = false
        try {
            let records = await client.getDirectoryContents(path) as Array<FileStat>
            let children_nodes = records.filter(r => r.type == 'directory').map(r => ({ key: r.filename, title: r.basename }))
            for (let child_node of children_nodes) 
                node_map[child_node.key] = child_node
            set_node_map({ ...node_map })
            if (parent_node == null)
                set_nodes(children_nodes)
            else {
                parent_node.children = children_nodes
                set_nodes([...nodes])
            }
            result = true
        }
        catch(e: any) { set_last_error(e.toString()) }
        set_loading(false)
        return result
    }
    const on_ok = async () => {
        if (! await fetch_nodes()) return
        let data: DavModalForm = await form.validateFields();
        let { url, ...options } = data
        if (url.endsWith('/'))
            url = url.substring(0, url.length - 1)
        url = url + data.basepath
        let names = (data.basepath ?? data.url).split("/")
        let name = names[names.length - 1]
        onOk(name, { driver: 'webdav', url, options: { username: options.username, password: options.password }})
    }
    const on_value_change = (changed: Partial<DavModalForm>) => {
        if (changed.basepath != null) return
        set_nodes([])
        set_node_map({})
        set_last_error(null)
    }
    return <Modal title="从WebDav打开"
                closable={false}
                destroyOnClose
                footer={<>
                    <Button disabled={loading} onClick={() => { fetch_nodes() }}>测试</Button>
                    <Button disabled={loading} onClick={() => { on_ok() }} type='primary'>确定</Button>
                </>}
                {...rest_props}
            >
        <Spin spinning={loading}>
            <Form<DavModalForm> form={form} clearOnDestroy onValuesChange={on_value_change} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} style={{ paddingTop: '20px' }}>
                <Form.Item label="URL" name="url"><Input placeholder="请输入WebDav服务器的地址" /></Form.Item>
                <Form.Item label="用户" name="username"><Input placeholder="如无验证，请留空"/></Form.Item>
                <Form.Item label="密码" name="password"><Input.Password placeholder="如无验证，请留空"/></Form.Item>
                <Form.Item label="路径" name="basepath"><Input placeholder="/" /></Form.Item>
            </Form>
            <Tree treeData={nodes} loadData={async (key: any) => fetch_nodes(key.key)} onSelect={(key) => form.setFieldValue("basepath", key[0])} height={ nodes.length == 0 ? 0 : 600 } />
            { last_eror && <Alert message={last_eror} type='error' /> }
        </Spin>
    </Modal>
}

function FileModal(props: GetProps<typeof Modal>) {
    let context = useContext(AppContext)
    let input = useRef<InputRef>(null);
    let [nodes, set_nodes] = useState<TreeDataNode[]>([])
    let [search, set_search] = useState("")
    useEffect(() => { file_tree(context.package_name, search).then(set_nodes) }, [props.open, search])
    return <Modal title="文件" closable={false} footer={null} afterOpenChange={(o) => { if (o) input.current?.select() }}  {...props}>
        {/*@ts-ignore*/}
        <Input ref={input} placeholder="搜索文件" style={{ margin: '4px 0px 8px 0px' }} onChange={(e) => set_search(e.currentTarget.value)} />
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
        onClick: () => download_database(context.selected_cards.length > 0 ? context.selected_cards.map(format).join("\n") : context.text)
    }, {
        key: 'json',
        label: <div>下载数据（.json）</div>,
        icon: <VscDebug />,
        onClick: () => download_json(context.package_name)
    }]
}

function PackageMenu(set_dialog: Dispatch<StateUpdater<string | null>>) {
    return [{
        key: 'new',
        label: '新建卡包',
        icon: <AiOutlineFolderAdd />,
        onClick: () => set_dialog('new')
    }, {
        key: 'open-dav',
        label: '从WebDav打开',
        icon: <AiOutlineCloudServer />,
        onClick: () => set_dialog('open_dav')
    }, {
        key: 'menu',
        label: '卡包列表',
        icon: <AiOutlineUnorderedList />,
        onClick: () => set_dialog('packages')
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
    let files: Record<string, string> | undefined = undefined
    if (context.selected_cards.length > 0) {
        files = {}
        let allow_script_files = context.selected_cards.map(card => "script/c" + card.code + ".lua")
        let allow_pics_files = context.selected_cards.map(card => "pics/" + card.code + ".jpg")
        for (let file of (await current_storage.keys())) {
            if (file == context.filename) {
                files[file] = context.selected_cards.map(format).join("\n")
            } else if (file.startsWith("script/")) {
                if (allow_script_files.indexOf(file) >= 0)
                    files[file] = ""
            } else if (file.startsWith("pics/")) {
                if (allow_pics_files.indexOf(file) >= 0)
                    files[file] = ""
            } else
                files[file] = ""
        }
    }
    let blob = await generate_package(files, (index, total, filename) => { 
        current_index = index;
        current_total = total;
        current_filename = filename;
    });
    clearInterval(n)
    let package_name = await current_package_name() ?? "MyDIY"
    download(package_name + ".ypk", blob)
}

async function download_json(name: string) {
    let data = await dump(current_storage);
    let data_string = JSON.stringify(data, null, 2);
    let blob = new Blob([data_string], { type: 'application/json' });
    download(name + ".json", blob)
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

async function new_package(context: Context, name: string, config?: any) {
    await set_package(name, config)
    await current_storage.setItem(name + ".txt", "")
    context.set_context({ ...context, package_name: name, filenames: [name + ".txt"], filename: name + ".txt", text: "", cards: [], card: undefined })
}

async function file_tree(name: string, search?: string): Promise<TreeDataNode[]> {
    let files = await current_storage.keys()
    let root_node: TreeDataNode = { key: 'root', title: name, children: [] }
    for (let full_filename of files) {
        if (full_filename == 'name') continue;
        if (search != null && search !== "" && full_filename.indexOf(search) < 0) continue;
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

function FilenameMenu(context: Context) {
    let call = async ({ key }: { key: string }) => {
        let filename = key
        set_text_filename(key)
        context.filename = filename
        context.set_context({ ...context, ...(await load_context()) });
    }
    let filename_set: Record<string, string> = {}
    for (let filename of context.filenames)
        filename_set[generate_package_name_from_filename(filename)] = filename
    let filenames = Object.keys(filename_set)
    if (filenames.length <= 1)
        return []
    return filenames.map((name) => ({
        key: filename_set[name],
        label: <div class="filename-menu">{name} {name == context.filename ? <AiFillCheckCircle size={18} /> : ""}</div>,
        onClick: (e: any) => { call(e) }
    }))
}

type ExpansionPack = {
    FileName: string,
    PackName: string,
    PackAuthor: string,
    PackHomePage: string
}
function PackageModal(props: GetProps<typeof Modal> & { package_name: string }) {
    const PACKAGE_FILE_NAME = "corres_srv.ini"
    let { package_name, ...rest_props } = props
    let [enable, set_enable] = useState(false)
    let [ini_structure, set_ini_structure] = useState<{ YGOProExpansionPack?: ExpansionPack }>({})
    const [form] = useForm<ExpansionPack>()
    let default_value = {
        "FileName": package_name + ".ypk",
        "PackName": package_name,
        "PackAuthor": "任性而为的DIY作者",
        "PackHomePage": "https://diy.ygo.pro"
    }
    const pull_file = async () => {
        let content = await current_storage.getItem<string>(PACKAGE_FILE_NAME)
        if (content == null)
            set_enable(false)
        else {
            set_enable(true)
            let structure = ini.parse(content)
            set_ini_structure(structure)
            let data = structure["YGOProExpansionPack"]
            form.setFieldsValue(data)
        }
    }
    const save_file = () => {
        ini_structure["YGOProExpansionPack"] = form.getFieldsValue()
        let ini_content = ini.stringify(ini_structure)
        current_storage.setItem(PACKAGE_FILE_NAME, ini_content)
    }
    const on_terminate = async () => {
        if (enable) save_file()
        else current_storage.removeItem(PACKAGE_FILE_NAME)
    }
    useEffect(() => { pull_file() }, [])
    return <Modal className='package-modal' {...rest_props} onCancel={() => {on_terminate(); props.onCancel?.call(null, null as any)}} title={<Flex justify="space-between">
        <div>编辑卡包信息</div>
        <Checkbox checked={enable} onChange={(e) => set_enable(e.target.checked)}>启用卡包信息文件</Checkbox></Flex>} footer={null} closable={false}>
        {!enable ? <Alert showIcon message="卡包信息文件已禁用。" /> : <Form<ExpansionPack> layout='vertical' form={form} initialValues={default_value}>
            <Form.Item name="FileName" key="FileName" label="文件名"><Input /></Form.Item>
            <Form.Item name="PackName" key="PackName" label="卡包名"><Input /></Form.Item>
            <Form.Item name="PackAuthor" key="PackAuthor" label="作者"><Input /></Form.Item>
            <Form.Item name="PackHomePage" key="PackHomePage" label="主页"><Input /></Form.Item>
        </Form>}
    </Modal>
}

export function Header() {
    const context = useContext(AppContext)
    const [dialog, set_dialog] = useState<string | null>(CURRENT_VERSION > seen_help ? 'help' : null)
    const close_dialog = () => set_dialog(null)
    return <Flex justify="space-between" className="header full">
        <Flex>
            <RiArchiveStackLine size="24" />
            <Dropdown menu={{ items: FilenameMenu(context) }}>
                <Typography.Title className="title" level={4} onClick={() => set_dialog('package')}>卡包 { context.package_name }</Typography.Title>
            </Dropdown>
        </Flex>
        <Space>
            <Tooltip title='上传并新建'><UploadWrapper><Button aria-label='upload' variant='link' icon={<AiOutlineUpload />} /></UploadWrapper></Tooltip>
            <Dropdown menu={{ items: DownloadMenu() }}><Button aria-label='download' variant='link' icon={<AiOutlineDownload />} /></Dropdown>
            <Dropdown menu={{ items: PackageMenu(set_dialog) }}><Button aria-label='packages' variant='link' icon={<AiOutlineFolderOpen />}></Button></Dropdown>
            <Tooltip title='帮助'><Button aria-label='help' variant='link' onClick={() => set_dialog("help")} icon={<AiOutlineQuestionCircle />} /></Tooltip>
            <Tooltip title='设置'><Button aria-label='settings' variant='link' onClick={() => set_dialog("settings")} icon={<AiOutlineSetting />} /></Tooltip >
            <SettingsModal is_open={dialog == 'settings'} on_close={() => { set_dialog(null) }} />
            <PackagesModal open={ dialog == 'packages' } onCancel={() => { set_dialog(null) } } />
            <PackageModal open={dialog == 'package'} package_name={context.package_name} onCancel={() => { set_dialog(null) }} />
            <HelpModal open={dialog == 'help'} width={1000} height={800} onCancel={() => { set_dialog(null); localforage.setItem("seen_help", CURRENT_VERSION)}} />
            <NewModal open={dialog == 'new'} onCancel={close_dialog} onOk={(n) => new_package(context, n).then(close_dialog)} />
            <FileModal open={dialog == 'files'} onCancel={close_dialog} />
            <OpenDavModal open={dialog == 'open_dav'} onCancel={close_dialog} onOk={(n, o) => set_package(n, o).then(close_dialog)} />
        </Space>
    </Flex>
}
