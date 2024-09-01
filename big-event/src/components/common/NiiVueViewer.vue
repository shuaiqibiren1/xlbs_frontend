<template>
  <div id="app">
    <h1>Select a Feature1</h1>
    <button @click="navigateToHtmlPage1" type="button">Go to HTML Page</button>
  </div>


  <div id="app">
    <h1>Select a Feature2</h1>
    <button @click="navigateToHtmlPage2" type="button">Go to HTML Page</button>
  </div>

  
  <div id="app">
    <h1>Select a Feature3</h1>
    <button @click="navigateToHtmlPage3" type="button">Go to HTML Page</button>
  </div>

  <div>
    <h1>NiiVue Component</h1>
    
    <!-- 按钮组 -->
    <div>
      <button @click="navigateTo('feature1')">Go to Feature 1</button>
      <button @click="navigateTo('feature2')">Go to Feature 2</button>
      <button @click="navigateTo('feature3')">Go to Feature 3</button>
    </div>
    
    <!-- 子路由内容将显示在这里 -->
    <router-view />
  </div>

</template>

<script setup>
import { onMounted } from 'vue';
import { Niivue, SHOW_RENDER } from '@niivue/niivue';
import { useRouter } from 'vue-router'; // 导入 useRouter 钩子

const router = useRouter(); // 获取 router 实例

const navigateTo = (feature) => {
  console.log(feature);
  router.push(`/display/${feature}`);
};


function navigateToHtmlPage3() {
  window.location.href = '/src/components/niimain/index3.html'; // 替换为你的 HTML 文件路径
}

function navigateToHtmlPage2() {
  window.location.href = '/src/components/niimain/index2.html'; // 替换为你的 HTML 文件路径
}

function navigateToHtmlPage1() {
  window.location.href = '/src/components/niimain/index1.html'; // 替换为你的 HTML 文件路径
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
