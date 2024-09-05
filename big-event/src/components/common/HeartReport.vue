<template>
  <div class="report-container">
    <div id="pdf-content">  
      <h1>心脏疾病诊疗报告</h1>

      <h2>患者信息</h2>
      <p>姓名: {{ userStore.info.username }}</p>
      <p>性别: {{ docStore.heartParameters.sex }}</p>
      <p>年龄: {{ docStore.heartParameters.age }}岁</p>

      <h2>诊断结果</h2>
      <p>{{ diagnosis.result }}</p>

      <h2>心脏参数</h2>
      <table class="table-section">
        <thead>
          <tr>
            <th>项目</th>
            <th>结果</th>
            <th>参考值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>胸部疼痛类型</td>
            <td>{{ docStore.heartParameters.cp }}</td>
            <td>0-3</td>
          </tr>
          <tr>
            <td>血压</td>
            <td>{{ docStore.heartParameters.trestbps }} mmHg</td>
            <td>90-140 mmHg</td>
          </tr>
          <tr>
            <td>胆固醇</td>
            <td>{{ docStore.heartParameters.chol }} mg/dL</td>
            <td>125-200 mg/dL</td>
          </tr>
          <tr>
            <td>空腹血糖</td>
            <td>{{ docStore.heartParameters.fbs }} mg/dL</td>
            <td>&lt;100 mg/dL</td>
          </tr>
          <tr>
            <td>心电图结果</td>
            <td>{{ docStore.heartParameters.restecg === 0 ? '正常' : '反常' }}</td>
            <td>正常</td>
          </tr>
          <tr>
            <td>最大心跳数</td>
            <td>{{ docStore.heartParameters.thalach }} bpm</td>
            <td>60-100 bpm</td>
          </tr>
          <tr>
            <td>运动时是否有心绞痛</td>
            <td>{{ docStore.heartParameters.exang === 0 ? '否' : '是' }}</td>
            <td>否</td>
          </tr>
          <tr>
            <td>ST segment 倾斜度</td>
            <td>{{ docStore.heartParameters.oldpeak }}</td>
            <td>0.0-2.5</td>
          </tr>
          <tr>
            <td>透视检查看到的血管数</td>
            <td>{{ docStore.heartParameters.ca }}</td>
            <td>0-3</td>
          </tr>
          <tr>
            <td>缺陷种类</td>
            <td>{{ docStore.heartParameters.thal == 1 ? '正常' : "固定"}}</td>
            <td>正常/固定/可逆</td>
          </tr>
        </tbody>
      </table>

      <h2>影像检查</h2>
      <div class="styled-text">心脏3D图像</div>
      <div class="image-gallery">
        <img v-for="(image, index) in docStore.images" :key="index" :src="image" alt="Uploaded Image" class="image-item" />
      </div>

      <div class="styled-text">心脏2D切片</div>
      <div class="image-gallery">
        <img v-for="(image, index) in docStore.images2D" :key="index" :src="image" alt="Uploaded Image" class="image-item" />
      </div>

      <h2 class="section-title">诊疗建议</h2>
      <div class="message">
        <span v-html="docStore.parsedMessage"></span>
      </div>

      <div class="footer">
        <p>此报告仅供参考，最终诊断请遵循专业医生的建议。</p>
        <p>报告生成日期: {{ reportDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useDocStore from '@/stores/document.js'
import useImageStore from '@/stores/images.js'
import useUserInfoStore from '@/stores/userInfo.js'
const docStore = useDocStore()
const imageStore = useImageStore()
const userStore = useUserInfoStore()

const reportDate = new Date().toLocaleDateString()

const diagnosis = {
  result: '该患者的心脏健康状况显示出一定异常。建议进一步检查。'
}

onMounted(async () => {
  await docStore.fetchHeartParameters(imageStore.segImgId)
  await docStore.fetchWenxinAdvice("注意休息早点睡觉")
  // 插入分页符
  insertPageBreaks()
})

const insertPageBreaks = () => {
  const content = document.getElementById('pdf-content')
  const children = content.children
  let accumulatedHeight = 0
  const pageHeight = 1120 // 每页1200px

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const childHeight = child.offsetHeight
    accumulatedHeight += childHeight

    if (accumulatedHeight > pageHeight) {
      console.log("hight")
      const pageBreak = document.createElement('div')
      pageBreak.className = 'page-break'
      child.parentNode.insertBefore(pageBreak, child)
      accumulatedHeight = childHeight // 重置高度，确保剩余部分继续计算
    }
  }
}

</script>

<style scoped>
/* 针对中文设置字体 */
body, p, h1, h2, table, td, th {
  font-family: '方正仿宋',Times New Roman, serif;
}

/* 针对英文设置字体 */
@font-face {  
  font-family: 'Times New Roman';  
  src: url('../../assets/fonts/Times-New-Roman.ttf') format('truetype');  
  unicode-range: U+0030-0039, U+0041-005A, U+0061-007A; 
}


.report-container {
  width: 800px;  
  margin: auto;  
  padding: 20px;  
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);  
  border: 1px solid #ddd;  
  border-radius: 8px;  
  display: flex;  
  flex-direction: column;  
  max-height: 1120px; 
  overflow-y: auto; 
}


h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-top: 30px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

p,
ul {
  font-size: 16px;
  line-height: 1.6;
}

.table-section {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table-section th, 
.table-section td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* 表格文本居中对齐 */
}

.table-section th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.styled-text {
  font-weight: bold;
  color: #0073e6; /* 添加颜色样式 */
  font-size: 18px;
  margin-top: 15px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  margin-left: 40px;
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.footer {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* .page-break {
  page-break-before: always; 
  height: 0;
} 
*/
.page-break {
  page-break-after: always;
  break-after: always;
  margin-bottom: 20px; /* 添加空白 */
}

.message {
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  max-width: 100%; /* 确保宽度不会超出容器 */
  word-wrap: break-word; /* 自动换行 */
  white-space: normal; /* 处理空白符 */
  overflow-wrap: break-word; /* 防止长单词溢出 */
  word-break: break-word; /* 长文本换行 */
}

.message * {
  white-space: normal !important; /* 强制子元素允许换行 */
  word-wrap: break-word !important; /* 自动换行 */
  word-break: break-word !important; /* 长文本换行 */
}

.message-content p {  
  padding-left: 2ch; /* 留出两个字符的空间 */  
  margin: 0; /* 可选：去掉段落的默认外边距 */  
}  

</style>
