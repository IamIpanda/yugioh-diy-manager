import { createRoot } from 'preact/compat/client'
import { App } from './app';
import "./index.css"
import 'yugioh-card-react/dist/style.css'

createRoot(document.getElementById('app')!).render(<App />)
