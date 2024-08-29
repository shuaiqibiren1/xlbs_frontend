<template>
  <el-card class="page-container">
    <div class="content">
      <div class="image-container">
        <transition name="fade" mode="out-in">
          <img :src="currentImage" alt="Image" class="image" key="currentImage" />
        </transition>
      </div>
      <div class="thumbnail-list" ref="thumbnailList">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image"
          @click="changeImage(index)"
          class="thumbnail"
          :class="{ active: index === currentIndex }"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import useImageStore from '@/stores/images.js'; // 导入Pinia store
import heartimg from '@/assets/heart.png'; // 导入默认图片

const imageStore = useImageStore();
const images = computed(() => imageStore.imageList);
const currentIndex = ref(0);
const thumbnailList = ref(null);

const imageId = computed(() => imageStore.segImgId); // 监控图像ID的变化

// 当前显示的图片，若 images 为空则显示 heartimg
const currentImage = computed(() => {
  return images.value.length ? images.value[currentIndex.value] : heartimg;
});

watch(imageId, () => {
  // 当id发生变化时，可以刷新模块的内容或其他相关操作
  currentIndex.value = 0; // 可以在id变化时重置当前索引
});

const changeImage = (index) => {
  currentIndex.value = index;
};

const handleWheel = (event) => {
  event.preventDefault(); // 阻止页面默认滚动
  event.stopPropagation(); // 阻止事件冒泡

  if (event.deltaY < 0) {
    // 向上滚动
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
  } else {
    // 向下滚动
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }
};

onMounted(() => {
  if (thumbnailList.value) {
    thumbnailList.value.addEventListener('wheel', handleWheel);
  }
});

onBeforeUnmount(() => {
  if (thumbnailList.value) {
    thumbnailList.value.removeEventListener('wheel', handleWheel);
  }
});
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.thumbnail {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #409eff;
}

.image-container {
  width: 600px;
  height: 400px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image {
  max-width: 100%;
  max-height: 100%;
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
