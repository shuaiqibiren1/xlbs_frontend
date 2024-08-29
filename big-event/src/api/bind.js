//导入request.js请求工具
import request from '@/utils/request.js'   // 在 vue.config.js 中，@ 通常被设置为指向 src 目录。


// 绑定
export const bindDPService = (patientData) => {
    return request.put('/user/bind', patientData)
}


// 获取绑定用户信息
export const DPatientsService = () => {
    return request.get('/doctor-patients/patientdetails')
}

// 获取绑定用户信息
export const deletePatientService = (data) => {
    return request.delete('/doctor-patients/deletepatient', {
        data: data
    });
}