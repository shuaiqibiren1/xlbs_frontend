//导入request.js请求工具
import request from '@/utils/request.js'   // 在 vue.config.js 中，@ 通常被设置为指向 src 目录。

// import request：这里 request 是在当前文件中使用的一个变量名，用于代表从 request.js 模块导入的内容。
// from '@/utils/request.js'：这部分表示要从 @/utils/request.js 文件中导入。在 Vue 项目中，@ 通常是项目根目录（src 文件夹）的别名。意味着你实际上从 src/utils/request.js 路径导入。
// 在其他文件中使用 import request from '@/utils/request.js' 时，实际上是在导入 request.js 文件中默认导出的 Axios 实例。此时，变量 request 将引用这个 Axios 实例。

//提供调用注册接口的函数
// export const userRegisterService: 这里使用了 ES6 的命名导出，将 userRegisterService 这个常量导出。这个常量被定义为一个箭头函数。
// (registerData) => {: 这个箭头函数接受一个参数 registerData，它通常是一个包含用户注册所需数据的对象（例如用户名、密码、邮箱等）
export const userRegisterService = (registerData) => {
    // 借助于UrlSearchParams完成传递
    // URLSearchParams 是一个用于处理 URL 查询字符串的内置 Web API。它使得在参数序列化时提供了一种方便的方式
    const params = new URLSearchParams()
    // for...in 循环遍历 registerData 对象的所有可枚举属性。key 变量代表对象中每个属性的名称。
    for (let key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('/user/register', params);
    // 向 /user/register 发送 POST 请求，将 params 作为请求体传递。并将返回结果再次作为箭头函数的返回
}
// 注：如果 registerData 是 { username: 'user1', password: 'pass123' }
// params 内部会变成：username=user1&password=pass123  

//提供调用登录接口的函数
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}


//获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/userInfo')
}

//修改个人信息
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user/update', userInfoData)
}


//修改头像
export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl)
    return request.patch('/user/updateAvatar', params)
}

// 更新用户评论
export const updateUserCommentService = (data) => {
    return request.put('/user/comment', data)
}
