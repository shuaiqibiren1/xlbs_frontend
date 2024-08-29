//定制请求的实例
// import { globals } from "@/main";
//导入axios  npm install axios
import axios from 'axios';


import { ElMessage } from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token.js'
//添加 Axios 请求拦截器 ，用于在请求发送之前执行某些操作
instance.interceptors.request.use(
    (config) => {
        // 第一个参数是一个回调函数，它在请求发送之前被调用。这个函数接受一个 config 对象作为参数，这个对象包含了请求的所有配置。
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        // 检查 tokenStore 是否存在 token。
        if (tokenStore.token) {
            // 如果存在 token，就将它添加到请求头的 Authorization 字段中。这通常用于 API 身份验证。
            config.headers.Authorization = tokenStore.token
        }
        return config;
        // 修改后的配置被返回给 Axios，随后请求将继续进行。
    },
    (err) => {
        //请求错误的回调
        // 如果请求配置过程中发生了错误，它会将错误通过 Promise.reject(err) 传递出去，以便后续的错误处理可以捕获到这个错误。
        Promise.reject(err)
    }
)
/*
这段代码的主要目的是在每次发送请求之前，检查用户是否已经登录（通过 token），如果是，就将 token 添加到请求头中，
以便进行身份验证。当请求发生错误时，也会正常处理错误。这种做法常见于需要认证的 API 请求场景。
*/


/* import {useRouter} from 'vue-router'
const router = useRouter(); */

import router from '@/router'  // '@/router' 将自动导入 `router/index.js` 中的默认导出 
//添加 Axios 的响应拦截器，可以在接收到服务器响应后执行某些操作。
instance.interceptors.response.use(
    result => {
        // 判断业务状态码
        // 如果业务逻辑中的状态码为 0，表示请求成功，返回 result.data
        if (result.data.code === 0) {
            return result.data;
        }

        //操作失败
        //alert(result.data.msg?result.data.msg:'服务异常')
        ElMessage.error(result.data.msg ? result.data.msg : '服务异常')
        //异步操作的状态转换为失败
        return Promise.reject(result.data)

    },
    err => {
        //判断响应状态码,如果为401,则证明未登录,提示请登录,并跳转到登录页面
        if (err.response.status === 401) {
            ElMessage.error('请先登录')
            router.push('/login')
        } else {
            ElMessage.error('服务异常')
        }

        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;