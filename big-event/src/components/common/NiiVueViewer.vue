<template>
  <el-upload class="upload-area" ref="uploadRef"  drag action="/api/niiupload" :multiple="true" :show-file-list="true"
    :headers="{ 'Authorization': tokenStore.token }" @change="handleChange" @success="handleSuccess"
    @error="handleError">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">Drop files here or click to upload</div>
  </el-upload>

  <div class="feature-section">
    <h1>心脏NIFTI图像3D显示</h1>

    <!-- 按钮组 -->
    <div class="button-group">
      <button @click="navigateTo('feature1')" class="styled-button">功能一</button>
      <button @click="navigateTo('feature2')" class="styled-button">功能二</button>
      <button @click="navigateTo('feature3')" class="styled-button">功能三</button>
    </div>

    <!-- 子路由内容将显示在这里 -->
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
import { ref } from 'vue'; 
import useImageStore from '@/stores/images.js';
import {ElMessage,ElMessageBox} from 'element-plus'
const tokenStore = useTokenStore();
const imageStore = useImageStore();
const router = useRouter();


const navigateTo = (feature) => {
  router.push(`/display/${feature}`);
};

const uploadRef = ref(null);  

const handleChange = (file, fileList) => {  
  const validExtensions = ['.nii.gz', '.nii'];  
  const isValid = validExtensions.some(ext => file.name.endsWith(ext));  

  if (!isValid) {  
    ElMessage.error('上传失败：文件名必须以 .nii.gz 或 .nii 结尾');  
    // 清空文件列表或其他处理逻辑  
    // 这里需要使用 ref 来引用 el-upload 组件  
    uploadRef.value.clearFiles();  
  }  
};  

// 上传成功时触发
const handleSuccess = (response, file, fileList) => {
  console.log('Upload Response:', response)  // 调试输出
  if (response.code === 0) {
    imageStore.setMaskniiImgUrl(response.data);
    console.log('niiImgList :', JSON.stringify(imageStore.niiImgList));

  } else {
    console.error('Error fetching files:', response.message);
  }
};

const handleError = (err, file, fileList) => {
  console.error('Upload failed:', err);
};


</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
}

.feature-section {
  margin-bottom: 20px;
}

.styled-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.styled-button:hover {
  background-color: #45a049;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}
</style>
