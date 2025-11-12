import { createRoot } from 'preact/compat/client'
import { App } from './app';
import "./index.css"
import 'yugioh-card-react/dist/style.css'

let root = createRoot(document.getElementById('app')!)
//root.render(<Splash callback={() => root.render(<App />)} />)
root.render(<App />)
