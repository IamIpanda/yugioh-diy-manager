import { Flex, Spin, Typography, Progress } from "antd";
import { useEffect, useState } from "preact/hooks";
import "./splash.css"

const PRELOAD_FONTS = [
    '/assets/yugioh/font/ygo-font.css',
    '/assets/custom-font/custom-font.css',
];

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function preload_font(url: string): Promise<void> {
    return new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = async () => {
            try {
                await new Promise(r => setTimeout(r, 0));
                const fontFaces = Array.from(document.fonts.values());
                const loadPromises = fontFaces.map(font => document.fonts.load(`16px "${font.family}"`));
                await Promise.all(loadPromises);
                resolve();
            } catch (error) {
                console.warn(`Error loading fonts from: ${url}`, error);
                resolve();
            }
        };
        document.head.appendChild(link);
    });
}

async function preload_wasm(callback?: (message: string) => void): Promise<void> {
    try {
        callback?.('正在加载 SQL.js WASM 模块... (1/2)')
        const Sqlite3InitModule = await import('@sqlite.org/sqlite-wasm');
        await Sqlite3InitModule.default({ print: console.log, printErr: console.error });
        callback?.('正在加载 CDB Transformer WASM 模块... (2/2)')
        await import('cdb-transformer');
    } catch (error) {
        console.warn('Failed to preload WASM modules:', error);
    }
}

async function preload(on_progress: (progress: number, message: string) => void): Promise<any> {
    try {
        let progress = 0;
        
        on_progress(progress = 0, '正在加载 WASM 模块...');
        await preload_wasm((message) => {
            progress += 10;
            on_progress(progress, message);
        });

        on_progress(progress = 20, '正在加载卡片数据...');
        const context = await import('./model/context');
        let context_value = await context.load_context((message) => {
            progress += 2;
            on_progress(progress, message);
        });
        
        on_progress(progress = 60, '正在载入页面...');
        await import('./app');

        on_progress(progress = 80, '正在加载字体文件...');
        
        const load_font = async () => {
            for (let i = 0; i < PRELOAD_FONTS.length; i++) {
                const fontUrl = PRELOAD_FONTS[i];
                await preload_font(fontUrl);
                progress = 80 + Math.floor(((i + 1) / PRELOAD_FONTS.length) * 20);
                on_progress(progress, `已加载字体: ${fontUrl.split('/').pop()}`);
            }
        }
        await Promise.race([load_font(), sleep(20000)])

        on_progress(progress = 100, '加载完成！')
        return context_value;
    }
    catch (error) {
        console.error('Preload error:', error);
        on_progress(100, '加载过程中出现错误，但将继续启动...');
    }
}

export function Splash({ callback }: { callback: (context_value: any) => void }) {
    const [progress, set_progress] = useState(0);
    const [message, set_message] = useState("正在初始化...");
    const [showWarning, set_show_warning] = useState(false);

    useEffect(() => {(async () => {
        try {
            let context_value = await preload((prog, msg) => {
                set_progress(prog);
                set_message(msg);
            });
            await sleep(200)
            callback(context_value);
        } catch (error) {
            console.error('Preload error:', error);
            set_message('加载过程中出现错误，但将继续启动...');
            await sleep(200)
            callback(null);
        }})();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => set_show_warning(true), 60 * 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Flex className='splash'>
            <Typography.Title level={2}>YGOPRO 卡包编辑器</Typography.Title>
            <Spin size="large" />
            <Progress 
                percent={progress} 
                status={progress === 100 ? 'success' : 'active'}
                style={{ width: '60%', marginTop: '20px' }}
            />
            <Typography.Text className="running" style={{ marginTop: '16px' }}>
                {message}
            </Typography.Text>
            {showWarning && (
                <Typography.Text type="warning" style={{ marginTop: '20px' }}>
                    如果加载时间过长，可能某个资源加载失败。可以尝试刷新页面。
                </Typography.Text>
            )}
        </Flex>
    );
}
