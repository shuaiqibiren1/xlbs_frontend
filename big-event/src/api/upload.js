//导入request.js请求工具
import request from '@/utils/request.js'   // 在 vue.config.js 中，@ 通常被设置为指向 src 目录。

export const fileUploadService = (file) => {
    // 创建一个 FormData 对象  
    const formData = new FormData();
    // 将文件添加到 FormData 对象中  
    formData.append('file', file);

    return request.post('/uploadnii', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 指定请求头为 form-data  
        }
    });
}

//获取用户详细信息
export const filesNameService = (patientId) => {
    // 将 patientId 对象转化为查询参数字符串
    const params = new URLSearchParams(patientId).toString();
    return request.get(`/patientfiles?${params}`);
}

export const deleteFileService = (data) => {
    return request.delete("/delete", {
        data: data
    });
};

export const ImagesService = (imgId) => {
    const params = new URLSearchParams(imgId).toString();
    return request.get(`/getImage?${params}`);
};

export const ModelImagesService = (imgId) => {
    const params = new URLSearchParams(imgId).toString();
    return request.get(`model/getImagem?${params}`);
};