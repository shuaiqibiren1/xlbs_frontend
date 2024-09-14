//导入request.js请求工具
import request from '@/utils/request.js'

export const ModelheartsegService = (data) => {
    return request.post("model/heartseg", data);
};

export const ModelheartscarService = (data) => {
    return request.post("model/heartscar", data);
};

export const AddFileService = (data) => {
    const params = new URLSearchParams(data).toString();
    return request.post(`/model/addfileByUrl?${params}`);
}