// @/api/wenxin.js
import request from '@/utils/request.js'   // 在 vue.config.js 中，@ 通常被设置为指向 src 目录。

export const ChatService = (question) => {
    const params = new URLSearchParams(question).toString();
    return request.post(`/wenxin/ask?${params}`);
};