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
          <button @click="deleteImage(1,index)" class="delete-button">×</button>
        </div>
      </div>
    </div>

    <div class="toggle-area" @click="toggleGallery(2)">
      <span class="toggle-icon" v-if="!isOpen2">▶</span>
      <span class="toggle-icon" v-else>▼</span>
      <span class="toggle-text">{{ isOpen2 ? '收起' : '展开' }} 2维图片</span>
    </div>
    <div v-if="isOpen2" class="image-gallery-container">
      <div class="image-gallery">
        <div v-for="(image, index) in docStore.images2D" :key="index" class="image-item-container">
          <img :src="image" alt="Uploaded Image" class="image-item" />
          <button @click="deleteImage(2,index)" class="delete-button">×</button>
        </div>
      </div>
    </div>

    <div class="toggle-area" @click="toggleGallery(3)">
      <span class="toggle-icon" v-if="!isOpen3">▶</span>
      <span class="toggle-icon" v-else>▼</span>
      <span class="toggle-text">{{ isOpen3 ? '收起' : '展开' }} 选择图片</span>
    </div>
    <div v-if="isOpen3" class="image-gallery-container">
      <div class="image-gallery">
        <div v-for="(file, index) in filesInfo" :key="file.id" class="image-item-container">
          <img :src="file.url" alt="Uploaded Image" class="image-item" @click="ChooseImage(file.filePath)"/>
          <div class="card-title">
          {{ file.fileName }}
          </div>
          <button @click="deleteImage(3,index)" class="delete-button">×</button>
        </div>
      </div>
    </div>

    <!-- 可拖拽的图标，点击时显示气泡 -->
    <img
      src="@/assets/Qassitant.png"
      class="drag-icon"
      @mousedown="startDrag"
      @click="togglePopover"
      alt="Drag Icon"
    />

    <!-- 气泡弹出框 -->
    <el-popover
      v-model:visible="showPopover"
      :width="500"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
      <template #reference>
        <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
      </template>
      <template #default>
        <div class="demo-rich-content" style="display: flex; gap: 16px; flex-direction: column">
          <el-avatar :size="60" src="https://avatars.githubusercontent.com/u/72015883?v=4" style="margin-bottom: 8px" />
          <div class="popover-content" >
            <!-- 显示当前图片 -->
            <img :src="images[currentImageIndex]" alt="指导图片" class="popover-image"/>
          </div>
          <!-- 图片切换按钮 -->
          <div class="image-controls">
            <el-button size="small" @click="prevImage" :disabled="currentImageIndex === 0">
              上一张
            </el-button>
            <el-button size="small" @click="nextImage" :disabled="currentImageIndex === images.length - 1">
              下一张
            </el-button>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import useDocStore from '@/stores/document.js';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import useFilesInfoStore from '@/stores/files.js';
import { ElMessage } from 'element-plus'
import useImageStore from '@/stores/images.js';
const imageStore = useImageStore();
import { useRouter } from 'vue-router';
const router = useRouter();
const filesInfoStore = useFilesInfoStore();
const filesInfo = computed(() => filesInfoStore.infos);

const docStore = useDocStore();
const isOpen = ref(false);
const isOpen2 = ref(false);
const isOpen3 = ref(false);
const position = reactive({ x: 0, y: 0 });
const marginThreshold = 120;

const deleteImage = (mode, index) => {
  if (mode === 1) {
    docStore.deleteImage(index);
  } else if (mode === 2) {
    docStore.deleteImage2D(index);
  } else if (mode === 3) {
    filesInfoStore.deleteInfo(index);
  }
};

const ChooseImage = (niiurl) => {
  imageStore.setniiImgUrl(niiurl);
  console.log(imageStore.niiImgUrl)
  ElMessage.success("修改成功")

  // 获取当前路由路径  
  const currentPath = route.path;  
  console.log("currentPath : ", currentPath);  

  // 只在特定路由下刷新页面  
  if (currentPath === '/display/feature1' ||   
      currentPath === '/display/feature2' ||   
      currentPath === '/display/feature3') {  
    window.location.reload();   
  } 
}

onMounted(() => {
  position.x = (window.innerWidth / 2) - 60;
  position.y = 600;
});

const toggleGallery = (mode) => {
  if (mode === 1) {
    isOpen.value = !isOpen.value;
  } else if (mode === 2) {
    isOpen2.value = !isOpen2.value;
  } else if (mode === 3) {
    isOpen3.value = !isOpen3.value;
  }
};

const togglePopover = (event) => {
  event.stopPropagation();
};

const startDrag = (event) => {
  const initialX = event.clientX - position.x;
  const initialY = event.clientY - position.y;

  const onMouseMove = (e) => {
    position.x = e.clientX - initialX;
    position.y = e.clientY - initialY;

    const windowWidth = window.innerWidth;

    if (position.x < marginThreshold) {
      position.x = 0;
      isOpen.value = false;
    } else if (position.x > windowWidth - marginThreshold) {
      position.x = windowWidth - marginThreshold;
      isOpen.value = false;
    }
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const showPopover = ref(false);
const currentImageIndex = ref(0);

const route = useRoute();

import zhushou from '@/assets/zhidao/zhushou.png'
import homedoctor from '@/assets/zhidao/homedoctor.png'
import wenjian from '@/assets/zhidao/wenjian.png'
import demotool from '@/assets/zhidao/demotool.png'
import Dshow3 from '@/assets/zhidao/3Dshow3.png'
import Dshow2 from '@/assets/zhidao/3Dshow2.png'
import baogao from '@/assets/zhidao/baogao.png'


const images = computed(() => {
  switch (route.path) {
    case '/demo':
      return [zhushou,demotool];
    case '/home':
      return [homedoctor,wenjian];
    case '/display/feature3':
      return [Dshow3];
    case '/display/feature2':
      return [Dshow2];
    case '/chat':
      return [baogao];
    default:
      return [];
  }
});

// 当路由改变时重置图片索引为 0
onBeforeRouteUpdate(() => {
  currentImageIndex.value = 0;
});

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  }
};
</script>


<style>
/* 气泡 */
.popover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* 固定宽度 */
  height: 300px; /* 固定高度 */
  overflow: auto; /* 超出内容时显示滚动条 */
}

.popover-image {
  max-width: 100%;
  margin-bottom: 10px;
}

.image-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* 气泡-over */
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

.card-title {
  color: black;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: all .2s ease-in-out;
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
