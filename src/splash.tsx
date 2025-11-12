import { Flex, Spin, Typography } from "antd";
import { useEffect, useState } from "preact/hooks";
import "./splash.css"

async function preload() {

}

export function Splash({ callback }: { callback?: () => void }) {
    let [running, _set_running] = useState("正在载入...")
    let [show_warning, warn] = useState(false)
    useEffect(() => { preload().then(callback) }, [])
    useEffect(() => { setTimeout(() => warn(true), 10 * 1000) }, [])
    return <Flex className='splash'>
            <Typography.Title>YGOPRO 卡包编辑器</Typography.Title>
            <Spin size="large" />
            <Typography.Text className="running">{running}</Typography.Text>
            { show_warning && <Typography.Text>如果你看到某个步骤长时间卡顿，可能此步骤已报错。</Typography.Text> }
        </Flex>
}
