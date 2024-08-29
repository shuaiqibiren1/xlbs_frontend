import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DPatientsService } from '@/api/bind.js'  // 假设你的服务文件路径是 @/services/apiService


const usePatientsInfoStore = defineStore('patients', () => {
    const infos = ref([])

    // 获取用户信息并更新 store
    const fetchInfos = async () => {

        infos.value = []
        try {
            const response = await DPatientsService()
            console.log('API Response:', response)  // 调试输出
            if (response.code === 0) {  // 确保响应成功
                infos.value = response.data
                console.log('Fetched Infos:', infos.value)  // 调试输出
            }
            else {
                console.error('Error fetching patients info:', response.message)
            }
        } catch (error) {
            console.log('Its OK')
        }
    }

    const setInfo = (newInfos) => {
        infos.value = newInfos
    }

    const removeInfo = () => {
        infos.value = []
    }

    const clearUserData = () => {
        infos.value = []
    }

    return { infos, setInfo, removeInfo, fetchInfos, clearUserData }
}, { persist: true })

export default usePatientsInfoStore
