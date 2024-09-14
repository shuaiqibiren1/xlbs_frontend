<template>
  <div>
    <el-button @click="changeshow">Upload Files</el-button>
    <div v-if="showUploadArea" class="upload-container">
      <el-upload
        class="upload-area"
        drag
        :action="`/api/model/uploadurlbyidm?id=${userInfo.id}`"
        :multiple="true"
        :show-file-list="true"
        :headers="{'Authorization': tokenStore.token}"
        @change="handleChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drag files here or click to upload</div>
      </el-upload>
      <el-button type="primary" @click="confirmUpload" class="confirm-button">Confirm</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({ ...userInfoStore.info });


const showUploadArea = ref(false);

const changeshow = () => {
  showUploadArea.value = !showUploadArea.value;
};

const handleChange = (file, fileList) => {
  console.log('Selected files:', fileList);
};

const confirmUpload = () => {
  showUploadArea.value = false;
  console.log('Files uploaded successfully!');
};
</script>

<style scoped>
.upload-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-area {
  width: 100%;
  border: 2px dashed #1e90ff;
  padding: 20px;
  background-color: #f0faff;
  text-align: center;
  border-radius: 15px;
  font-family: 'Microsoft YaHei', sans-serif; /* 设置字体为等线 */
}



.confirm-button {
  margin-top: 20px; /* 增加 Confirm 按钮与上传区域之间的间隔 */
}
</style>
