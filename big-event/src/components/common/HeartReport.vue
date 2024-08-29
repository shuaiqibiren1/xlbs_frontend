<template>
  <div class="report-container">
    <div id="pdf-content">
      <h1 class="title">心脏诊疗报告</h1>
      <p class="content">心脏参数:</p>
      <ul class="content">
        <li>年龄: {{ docStore.heartParameters.age }}</li>
        <li>性别: {{ docStore.heartParameters.sex }}</li>
        <li>胸部疼痛类型: {{ docStore.heartParameters.cp }}</li>
        <li>血压: {{ docStore.heartParameters.trestbps }}</li>
        <li>胆固醇: {{ docStore.heartParameters.chol }}</li>
        <li>空腹血糖: {{ docStore.heartParameters.fbs }}</li>
        <li>心电图结果: {{ docStore.heartParameters.restecg }}</li>
        <li>最大心跳数: {{ docStore.heartParameters.thalach }}</li>
        <li>运动时是否有心绞痛: {{ docStore.heartParameters.exang }}</li>
        <li>相对于休息的 ST segment 的倾斜度: {{ docStore.heartParameters.oldpeak }}</li>
        <li>透视检查看到的血管数: {{ docStore.heartParameters.ca }}</li>
        <li>缺陷种类: {{ docStore.heartParameters.thal }}</li>
      </ul>
      
      <h2 class="section-title">诊疗建议:</h2>
      <!-- <p class="content">{{ docStore.suggestedAdvice }}</p> -->
      <span v-html="docStore.parsedMessage"></span> 
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useDocStore from '@/stores/document.js'; 
import useImageStore from '@/stores/images.js';  
const docStore = useDocStore();
const imageStore = useImageStore();
import { marked } from 'marked';

// 在组件挂载时调用函数
onMounted(async() => {
  await docStore.fetchHeartParameters(imageStore.segImgId)
  await docStore.fetchWenxinAdvice("注意休息早点睡觉")
});


</script>

<style scoped>
@font-face {
  font-family: 'FZFS';
  src: url('@/assets/fonts/fzfs.ttf') format('truetype');
}

.report-container {
  font-family: 'FZFS', 'Times New Roman', sans-serif;
  width: 800px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content {
  font-size: 16px;
  line-height: 1.6;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 5px;
}
</style>
