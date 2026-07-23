import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/style.scss'
import './assets/style/tailwind.css'

// 引入 svgtofont 自動生成的 CSS
import './assets/fonts/svg-font.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.mount('#app')