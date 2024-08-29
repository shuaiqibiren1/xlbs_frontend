import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import heartimg from '@/assets/heart.png';
import { ImagesService } from '@/api/upload';

const useImageStore = defineStore('images', () => {
    // 定义状态
    const images = ref([heartimg]);
    const segImgId = ref(0);

    // 实时获取图片数组的计算属性
    const imageList = computed(() => images.value);

    // 添加图片的方法
    const addImage = (image) => {
        images.value.push(image);
    };

    // 设置图片ID的方法
    const setImgId = (id) => {
        segImgId.value = id;
    };

    // 移除所有图片的方法
    const removeImage = () => {
        images.value = [];
        segImgId.value = 0;
    };

    // 从服务端获取图片并添加到图片列表
    const fetchImages = async (imageId) => {
        images.value = [];
        const Id = {
            id: imageId
        };
        console.log('ImageId is :', Id);
        console.log('segImgId.value :');
        try {
            const response = await ImagesService(Id);
            console.log('API Response:', response);  // 调试输出
            if (response.code === 0) {  // 确保响应成功
                const imageUrls = response.data;
                imageUrls.forEach(url => {
                    addImage(url);
                });
                console.log('Fetched Infos:', imageList.value);  // 调试输出
            } else {
                console.error('Error fetching images:', response.message);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    return { imageList, segImgId, addImage, removeImage, setImgId, fetchImages };
}, { persist: true });

export default useImageStore;
