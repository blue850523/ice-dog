import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './assets/style/style.scss'
import './assets/style/tailwind.css'

// 引入 svgtofont 自動生成的 CSS
import './assets/fonts/svg-font.css'

const app = createApp(App)
const pinia = createPinia()
// pinia自動存到local套件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.mount('#app')