<template>
  <div class="collapsible-gallery" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    <div class="toggle-area" @click="toggleGallery">
      <span class="toggle-icon" v-if="!isOpen">▶</span>
      <span class="toggle-icon" v-else>▼</span>
      <span class="toggle-text">{{ isOpen ? '收起' : '展开' }} 图片</span>
    </div>
    <div v-if="isOpen" class="image-gallery">
      <img v-for="(image, index) in docStore.images" :key="index" :src="image" alt="Uploaded Image" class="image-item" />
    </div>
    <img src="@/assets/Qassitant.png" class="drag-icon" @mousedown="startDrag" v-if="!isOpen" alt="Drag Icon" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import useDocStore from '@/stores/document.js';
import dragIcon from '@/assets/Qassitant.png'; // 导入自定义图标

const docStore = useDocStore();
const isOpen = ref(false); // 控制折叠状态
const position = reactive({ x: 0, y: 0 }); // 初始化拖动位置
const marginThreshold = 30; // 定义吸附边框的距离阈值

// 初始化组件位置，居中
onMounted(() => {
  position.x = (window.innerWidth / 2) - 60; // 将组件初始位置设置在水平居中，调整偏移量以居中
  position.y = 100; // 你可以根据需要调整垂直位置
});

const toggleGallery = () => {
  isOpen.value = !isOpen.value; // 切换折叠状态
};

const startDrag = (event) => {
  const initialX = event.clientX - position.x;
  const initialY = event.clientY - position.y;

  const onMouseMove = (e) => {
    position.x = e.clientX - initialX;
    position.y = e.clientY - initialY;

    // 获取窗口尺寸
    const windowWidth = window.innerWidth;

    // 处理水平边框吸附
    if (position.x < marginThreshold) {
      position.x = 0; // 吸附到左边框
      isOpen.value = false; // 靠近左边自动收起
    } else if (position.x > windowWidth - marginThreshold) {
      position.x = windowWidth - marginThreshold; // 吸附到右边框
      isOpen.value = false; // 靠近右边自动收起
    }
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
</script>

<style>
.collapsible-gallery {
  position: absolute; /* 允许通过拖动改变位置 */
  margin: 20px;
}

.toggle-area {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-icon {
  margin-right: 5px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.image-item {
  max-width: 200px; /* 设置图像最大宽度 */
  margin: 10px; /* 设置图像间距 */
}

.drag-icon {
  position: absolute;
  left: -100px; /* 调整图标位置 */
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize; /* 拖动光标样式 */
  width: 100px; /* 图标大小，可以根据需要调整 */
  height: 100px;
  user-select: none; /* 禁止选中文本 */
}
</style>
