import { createRoot } from 'preact/compat/client'
import { Splash } from './splash';
import "./index.css"
import 'yugioh-card-react/dist/style.css'

let root = createRoot(document.getElementById('app')!)
root.render(<Splash callback={async (context_value: any) => {
    const { App } = await import('./app');
    root.render(<App context_value={context_value} />);
}} />)

