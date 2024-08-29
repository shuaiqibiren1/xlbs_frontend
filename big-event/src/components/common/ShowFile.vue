<template>
  <div class="file-list">
    <ul>
      <li
        v-for="file in filesInfo"
        :key="file.id"
        :class="{ selected: file.id === selectedId }"
        @click="handleFileClick(file.id)"
      >
        {{ file.fileName }}
      </li>
    </ul>
    <el-button type="primary" @click="confirmSelection" class="confirm-button">Confirm</el-button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import useFilesInfoStore from '@/stores/files.js';
import useImageStore from '@/stores/images.js';

const filesInfoStore = useFilesInfoStore();
const filesInfo = computed(() => filesInfoStore.infos);
const selectedId = ref(null);

const imageStore = useImageStore();

const handleFileClick = (id) => {
  selectedId.value = id;
};

const confirmSelection = async () => {
  if (selectedId.value) {
    await imageStore.fetchImages(selectedId.value);
    imageStore.setImgId(selectedId.value);  
  }
};
</script>

<style scoped>
.file-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.file-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-list li {
  cursor: pointer;
  padding: 15px;
  font-family: Arial, sans-serif;
  border-bottom: 1px solid #ddd;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 40px;
  background-color: white;
  transition: background-color 0.3s ease;
}

.file-list li.selected {
  background-color: #007bff; /* 选中时的深色 */
  color: white; /* 改变文字颜色为白色 */
}

.file-list li:hover {
  background-color: #f0f0f0;
}

.confirm-button {
  margin-top: 20px;
}
</style>
