import { Row, Col, Divider, Spin } from 'antd'
import { useEffect, useState } from 'preact/hooks'
import { Editor } from './editor'
import { Header } from './header'
import TextInput from './Input'
import { default_config_value, default_context_value, AppContext, ConfigContext } from './model/context'

import "./app.css"
import { current_storage } from './model/storage'

export function App() {
    let [config, set_config] = useState(default_config_value)
    let [context, set_context] = useState(default_context_value)
    config.set_config = set_config;
    context.set_context = set_context;
    useEffect(() => { current_storage.setItem(context.filename, context.text) }, [context.text])
    return  <ConfigContext.Provider value={config}>
            <AppContext.Provider value={context}>
            <Spin className="main-spinner" spinning={context.loading != null} tip={context.loading} size="large">
                <Row span={24} className="full-wdith header-container">
                    <Header />
                </Row>
                <Divider style={{ margin: '0' }} />
                <Row span={24} className="full-width container">
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
}
