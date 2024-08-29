//导入request.js请求工具
import request from '@/utils/request.js'   // 在 vue.config.js 中，@ 通常被设置为指向 src 目录。

export const heartParametersService = (fileId) => {
    // 将 patientId 对象转化为查询参数字符串
    const params = new URLSearchParams(fileId).toString();
    return request.get(`/heartParameters?${params}`);
}

//获取用户详细信息
export const wenxinService = (message) => {
    // 使用 request 封装工具发送 PUT 请求
    return request.put('/uploadheartParameters', message);
};
