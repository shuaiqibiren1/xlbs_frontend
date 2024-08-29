import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import App from './App.vue'
import { createPinia } from 'pinia'
import store from '@/store'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'

import '@/assets/css/animation.css'
import '@/assets/css/index.css'
import '@/assets/css/tocbot.css'
import '@/assets/css/color.css'
import '@/assets/css/markdown-highlight.css'
import '@/assets/css/font-awesome.min.css'

import 'element-plus/dist/index.css';

const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(store)
app.use(ElementPlus, { locale });
app.mount('#app')
