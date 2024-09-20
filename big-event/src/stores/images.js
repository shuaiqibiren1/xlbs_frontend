import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import heartimg from '@/assets/heart.png';
import { ImagesService, ModelImagesService } from '@/api/upload';

const useImageStore = defineStore('images', () => {
    // 定义状态
    const images = ref([heartimg]);
    const segImgId = ref(0);
    // const niiImgUrl = ref('https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/mni152.nii.gz');
    const niiImgUrl = ref('https://aircraft-1111.oss-cn-beijing.aliyuncs.com/a7e44048-f99a-4e5c-a8eb-3bec5dbfaf95_mr_train_1001_label.nii.gz');
    const maskNiiImageUrl = ref('');
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

    const setMaskniiImgUrl = (url) => {
        maskNiiImageUrl.value = url;
    }

    // 移除所有图片的方法
    const removeImage = () => {
        images.value = [];
        segImgId.value = 0;
    };


    // 移除所有图片的方法
    const setniiImgUrl = (url) => {
        console.log('Adding NII Image:', url);
        niiImgUrl.value = url;
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
            const response = await ModelImagesService(Id);
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

    return { imageList, maskNiiImageUrl, segImgId, niiImgUrl, addImage, removeImage, setImgId, fetchImages, setniiImgUrl, setMaskniiImgUrl };
}, { persist: true });

export default useImageStore;
