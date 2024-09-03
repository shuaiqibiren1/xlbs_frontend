<template>
  <el-upload
    class="upload-area"
    drag
    action="/api/niiupload"
    :multiple="true"
    :show-file-list="true"
    :headers="{'Authorization': tokenStore.token}"
    @change="handleChange"
    @success="handleSuccess"
    @error="handleError"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">Drop files here or click to upload</div>
  </el-upload>

  <el-button type="primary" @click="uploadCanvasImage">添加Canvas图片到报告中</el-button>
    <el-upload
      ref="uploadRef"
      action="/api/niiupload"
      :multiple="false"
      :show-file-list="false"
      :headers="{'Authorization': tokenStore.token}"
      :before-upload="beforeUpload1"
      @success="handleSuccess1"
      @error="handleError1"
      style="display: none;" 
    ></el-upload>

  <div class="feature-section">
    <h1>NiiVue Component</h1>
    
    <!-- 按钮组 -->
    <div class="button-group">
      <button @click="navigateTo('feature1')" class="styled-button">Go to Feature 1</button>
      <button @click="navigateTo('feature2')" class="styled-button">Go to Feature 2</button>
      <button @click="navigateTo('feature3')" class="styled-button">Go to Feature 3</button>
    </div>
    
    <!-- 子路由内容将显示在这里 -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
import useDocStore from '@/stores/document.js'; 
import useImageStore from '@/stores/images.js'; 


const imageStore = useImageStore();
const tokenStore = useTokenStore();
const router = useRouter();
const docStore = useDocStore();

const navigateTo = (feature) => {
  router.push(`/display/${feature}`);
};

function navigateToHtmlPage(feature) {
  window.location.href = `/src/components/niimain/index${feature}.html`;
}

const handleChange = (file, fileList) => {
  console.log('Selected files:', fileList);
};

// 上传成功时触发
const handleSuccess = (response, file, fileList) => {
  console.log('Upload Response:', response)  // 调试输出
  if (response.code === 0) {
      imageStore.setniiImgUrl(response.data);
      console.log('niiImgList :', JSON.stringify(imageStore.niiImgList));

  } else {
      console.error('Error fetching files:', response.message);
  }
};

const handleError = (err, file, fileList) => {
  console.error('Upload failed:', err);
};

// 上传Canvas图片

// 获取上传组件的引用
const uploadRef = ref(' ');

const beforeUpload1 = (file) => {
  // 阻止默认文件上传行为，改为手动添加canvas生成的文件
  return false;
};

const uploadCanvasImage = async () => {
  await nextTick();  // 确保 Vue 的 DOM 更新已经完成

  const canvas = document.getElementById('gl1');  // 获取 canvas 元素
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }

  // 确保内容已经绘制完成
  const drawScene = () => {
    // 此处需要调用实际绘制内容的函数
    // 例如，如果你有 `this.drawScene()` 函数，确保调用
    console.log('开始绘制场景');
    // 这里根据实际情况调用绘制函数
  };

  drawScene();  // 绘制内容

  // 使用和 saveScene 类似的逻辑来处理上传
  canvas.toBlob(async (blob) => {
    if (!blob) {
      console.error('Blob is null');
      return;
    }

    const file = new File([blob], 'canvas-image.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/niiupload', {
        method: 'POST',
        headers: {
          'Authorization': tokenStore.token
        },
        body: formData
      });
      const data = await response.json();
      handleSuccess1(data, file);
    } catch (err) {
      handleError1(err, file);
    }
  }, 'image/png');
};

const handleSuccess1 = (response, file, fileList) => {
  // 假设服务器返回的URL在response.url中
  docStore.addImage(response.data)
  console.log("docStore images : ",docStore.images)
  console.log('上传成功:', response.data)  // 调试输出
  // 在这里你可以处理这个URL，例如显示在页面上，或传递给其他地方
};

const handleError1 = (err, file, fileList) => {
  console.error('上传失败:', err);
};
// 上传Canvas图片 - over


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
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}
</style>
