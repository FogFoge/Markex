import './assets/style.css'
import 'highlight.js/styles/github.css'
//@ts-ignore A weird error without effect
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
