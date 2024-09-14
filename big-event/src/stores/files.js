import { defineStore } from 'pinia'
import { ref } from 'vue'
import { filesNameService, deleteFileService } from '@/api/upload.js'

const useFilesInfoStore = defineStore('files', () => {
    const infos = ref([])

    // 获取用户信息并更新 store
    const fetchInfos = async (userid) => {
        infos.value = [];
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

    const deleteInfo = async (index) => {
        const data = {
            fileId: infos.value[index].id
        };

        try {
            const result = await deleteFileService(data);

            if (result.code === 0) {
                // 成功删除文件后更新状态  
                console.log(result.message);
                // 从 infos 中删除文件  
                infos.value.splice(index, 1);
            } else {
                console.error('Error deleting file:', result.message);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };



    return { infos, setInfo, removeInfo, fetchInfos, clearUserData, deleteInfo }
}, { persist: true })

export default useFilesInfoStore
