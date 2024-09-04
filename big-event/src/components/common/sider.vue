<template>  
  <div class="collapsible-gallery" :style="{ left: `${position.x}px`, top: `${position.y}px` }">  
    <div class="toggle-area" @click="toggleGallery(1)">  
      <span class="toggle-icon" v-if="!isOpen">▶</span>  
      <span class="toggle-icon" v-else>▼</span>  
      <span class="toggle-text">{{ isOpen ? '收起' : '展开' }} 3维图片</span>  
    </div>  
    <div v-if="isOpen" class="image-gallery-container">  
      <div class="image-gallery">  
        <div v-for="(image, index) in docStore.images" :key="index" class="image-item-container">  
          <img :src="image" alt="Uploaded Image" class="image-item" />  
          <button @click="deleteImage(index)" class="delete-button">×</button>  
        </div>  
      </div>  
    </div>  

    <div class="toggle-area" @click="toggleGallery(2)">  
      <span class="toggle-icon" v-if="!isOpen2">▶</span>  
      <span class="toggle-icon" v-else>▼</span>  
      <span class="toggle-text">{{ isOpen ? '收起' : '展开' }} 2维图片</span>  
    </div>  
    <div v-if="isOpen2" class="image-gallery-container">  
      <div class="image-gallery">  
        <div v-for="(image, index) in docStore.images2D" :key="index" class="image-item-container">  
          <img :src="image" alt="Uploaded Image" class="image-item" />  
          <button @click="deleteImage(index)" class="delete-button">×</button>  
        </div>  
      </div>  
    </div>

    <img src="@/assets/Qassitant.png" class="drag-icon" @mousedown="startDrag"  alt="Drag Icon" />  
  </div>  
</template>    

<script setup>
import { ref, reactive, onMounted } from 'vue';
import useDocStore from '@/stores/document.js';

const docStore = useDocStore();
const isOpen = ref(false); // 控制折叠状态
const isOpen2 = ref(false); // 控制折叠状态
const Modenow = ref(0);
const position = reactive({ x: 0, y: 0 }); // 初始化拖动位置
const marginThreshold = 120; // 定义吸附边框的距离阈值

const deleteImage = (index) => {  
  if(Modenow.value === 1){
    docStore.deleteImage(index); // 调用 store 中的删除方法 
  } else if(Modenow.value === 2){
    docStore.deleteImage2D(index); // 调用 store 中的删除方法 
  }
  console.log("delete : ", index)
};  

// 初始化组件位置，居中
onMounted(() => {
  position.x = (window.innerWidth / 2) - 60; // 将组件初始位置设置在水平居中，调整偏移量以居中
  position.y = 100; // 你可以根据需要调整垂直位置
});

const toggleGallery = (mode) => {
  Modenow.value = mode
  if(mode === 1){
    isOpen.value = !isOpen.value; // 切换折叠状态
  } else if(mode === 2) {
    isOpen2.value = !isOpen2.value; 
  }
  
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

.image-gallery-container {  
  padding: 10px;  
  border-radius: 12px;  
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);  
  background-color: var(--love);  
  color: var(--white);
}  

.image-gallery {  
  display: flex;  
  flex-wrap: wrap;  
}  

.image-item-container {  
  position: relative;  
  display: inline-block;  
  margin: 10px;  
}  

.image-item {  
  max-width: 150px; /* 设置图片最大宽度 */  
  max-height: 150px; /* 设置图片最大高度 */  
  border-radius: 8px; /* 圆角效果 */  
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 图片阴影效果 */  
}  

.delete-button {  
  position: absolute;  
  top: 5px;  
  right: 5px;  
  background-color: rgba(255, 0, 0, 0.7);  
  color: white;  
  border: none;  
  border-radius: 50%;  
  width: 25px;  
  height: 25px;  
  cursor: pointer;  
  font-size: 18px;  
  line-height: 25px; /* 垂直居中 */  
  text-align: center;  
  transition: background-color 0.3s;  
}  

.delete-button:hover {  
  background-color: rgba(255, 0, 0, 1); /* 悬停时加深颜色 */  
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
