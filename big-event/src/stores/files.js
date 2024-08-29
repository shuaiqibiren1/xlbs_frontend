import { defineStore } from 'pinia'
import { ref } from 'vue'
import { filesNameService, deleteFileService } from '@/api/upload.js'

const useFilesInfoStore = defineStore('files', () => {
    const infos = ref([])

    // 获取用户信息并更新 store
    const fetchInfos = async (userid) => {
        const Id = {
            id: userid
        };
        console.log("ID:", Id);
        try {
            const response = await filesNameService(Id);
            console.log('API Response:', response)  // 调试输出
            if (response.code === 0) {
                infos.value = response.data
                console.log(response.data);
            } else {
                console.error('Error fetching files:', response.message);
            }
        } catch (error) {
            console.error('Error fetching filesName:');
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

export default useFilesInfoStore
