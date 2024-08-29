import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import HomeVue from '@/components/home.vue'
import DemoVue from '@/components/demo.vue'
import UserVue from '@/components/user.vue'
import ChatVue from '@/components/gpt.vue'
import usePatientsInfoStore from '@/stores/patients.js'


// 定义了一组路由配置，并使用 Vue Router 创建一个路由器实例。在 Vue.js 应用中，路由用于管理不同页面（或组件）之间的导航。
const routes = [
    { path: '/login', component: LoginVue },
    // 定义了一条路由。当用户访问 /login 路径时，应用将渲染 LoginVue 组件，通常用于用户登录界面。
    {
        path: '/', component: HomeVue, redirect: '/demo', children: [
            { path: '/demo', component: DemoVue },
            { path: '/home', component: UserVue },
            { path: '/chat', component: ChatVue },
        ]
        // { path: '/', component: LayoutVue, ... }: 这是另一个路由对象，它定义了根路径 / 的路由。这里使用的 LayoutVue 组件通常是一个包含应用布局的主组件。
        // redirect: '/article/manage': 这表示当用户访问根路径 / 时，应用将会自动重定向到 /article/manage 路径。
        // children: [: 这是一个子路由数组，表示嵌套路由。这些子路由的路径是相对于父路径 / 的。
    }
]


//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})


router.beforeEach((to, from, next) => {
    const patientsInfoStore = usePatientsInfoStore()
    if (patientsInfoStore.infos && to.name === 'login') {
        userStore.clearUserData(); // 清除数据
    }
    next();
});


//导出路由
export default router
