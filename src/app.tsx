import { Row, Col, Divider, Spin, ConfigProvider, theme as antdTheme } from 'antd'
import { useEffect, useRef, useState } from 'preact/hooks'
import { Editor } from './editor'
import { Header } from './header'
import TextInput from './Input'
import { default_config_value, default_context_value, AppContext, ConfigContext, reload_context, Context } from './model/context'

import "./app.css"
import { persist } from './model/history';

export function App({ context_value }: { context_value?: Partial<Context> }) {
    let [config, set_config] = useState({
        ...default_config_value,
        isDark: window.matchMedia('(prefers-color-scheme: dark)').matches
    })
    let [context, set_context] = useState({ ...default_context_value, ...context_value })
    config.set_config = set_config;
    context.set_context = set_context;
    if (context_value == null)
        useEffect(() => { reload_context(context) }, [])

    let text_loaded_from_storage = useRef(false)
    useEffect(() => { document.body.classList.toggle('dark', config.isDark) }, [config.isDark])
    useEffect(() => { text_loaded_from_storage.current = true }, [context.filename])
    useEffect(() => {
        if (text_loaded_from_storage.current) {
            text_loaded_from_storage.current = false
            return
        }
        if (context.filename && context.filename != '')
            set_context(c => ({ ...c, saving: true }))
    }, [context.text])
    useEffect(() => {
        if (!context.saving || !context.filename || context.filename == '') return
        persist(context.filename, context.text, config.history).finally(() => set_context(c => ({ ...c, saving: false })))
    }, [context.saving])
    return  <ConfigProvider theme={{ algorithm: config.isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}>
            <ConfigContext.Provider value={config}>
            <AppContext.Provider value={context}>
            <Spin className="main-spinner" spinning={context.loading != null} tip={context.loading} size="large">
                <Row className="full-wdith header-container">
                    <Header />
                </Row>
                <Divider style={{ margin: '0' }} />
                <Row className="full-width container">
                    <Col className="input-container" span={12} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <TextInput />
                    </Col>
                    <Col className="editor-container" span={12} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Editor />
                    </Col>
                </Row>
            </Spin>
            </AppContext.Provider>
            </ConfigContext.Provider>
            </ConfigProvider>
}
