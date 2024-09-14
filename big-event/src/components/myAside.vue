<template>
  <div>

    <div class="myAside-container ">
      <!-- 3D模型展示 -->
      <!-- v-if="asideshow.cube" -->
      <!-- <div  ref="container" class="three-container"></div>  -->
      <!-- <div ref="container" class="three-container" @click="toggleCube"></div>   -->
      <!-- <div class="three-container">  -->
        <img src="@/assets/heartomg.gif" class="three-container"/>    
      <!-- </div>   -->

      <!-- tool -->


    <div v-if="asideshow.segtool" style="padding: 15px;border-radius: 5px;animation: hideToShow 1s ease-in-out"
         class=".tool-container shadow-box background-opacity">  
        <div style="font-family: 'Microsoft YaHei';margin-bottom: 10px;" @click="showdiaWindows()">  Tools </div>

            <el-card
              v-for="card in cards"
              :key="card.id"
              class="menu-item"
              :class="{ 'active': isOpen(card.id) }"
              @click="toggleDropdown(card.id)"
              :body-style="{ padding: '8px' }"
            >
              <div class="menu-title" :class="{ 'selected-title': openedMenus === card.id }">
                <img :src="card.icon" class="menu-icon" :alt="`Icon ${card.id}`" /> {{ card.title }}
              </div>
              <div class="small-blue-font" v-if="isOpen(card.id)">{{card.description}}</div>
              <div class="button-container" v-if="isOpen(card.id)">
                <el-button
                  v-for="button in card.buttons"
                  :key="button.action"
                  class="button-title"
                  @click.prevent="executeAction(button.action)"
                >
                  {{ button.label }}
                </el-button>

              <FileUpload v-if="isOpen(1)" />
              <ShowFile v-else-if="isOpen(2)" />


              </div>
            </el-card>
    </div>  

      <!-- 网站信息 -->
      <div v-if="asideshow.user" class="card-content1 shadow-box background-opacity">
        <el-avatar style="margin-top: 20px" class="user-avatar" :size="120" :src="userInfo.userPic"></el-avatar>
        <div class="web-name">{{ userInfo.username }}</div>
        <div class="web-info">
          <div class="blog-info-box">
            <span>昵称</span>
            <span class="blog-info-num">{{ userInfo.nickname }}</span>
          </div>
          <div class="blog-info-box">
            <span>名称</span>
            <span class="blog-info-num">{{ userInfo.username }}</span>
          </div>
          <div class="blog-info-box">
            <span>身份</span>
            <span class="blog-info-num">{{ userInfo.identity }}</span>
          </div>
        </div>
        <!-- <a class="collection-btn" @click="showTip"> -->
        <a class="collection-btn">
          <i class="el-icon-star-off" style="margin-right: 2px"></i>{{ userInfo.email }}
        </a>
      </div>
    <div v-if="asideshow.wenxin" 
       style="padding: 15px; border-radius: 10px; animation: hideToShow 1s ease-in-out"
       class="shadow-box background-opacity wow">
    <div style="color: var(--lightGreen); font-size: 20px; font-weight: bold; margin-bottom: 10px" 
         @click="showWenxin()">
      文心智能助手
    </div>

    <!-- 问答功能部分 -->
    <div class="chat-window" style="max-height: 300px; overflow-y: auto; margin-bottom: 10px;">
      <div class="message-list">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          class="message" 
          :class="{ 'user-message': msg.isUser }"
        >  
          <span v-if="msg.isUser">{{ msg.text }}</span>  
          <span v-else v-html="msg.text"></span>
        </div>
      </div>
    </div>

    <div style="display: flex; margin-bottom: 10px;">
      <input class="ais-SearchBox-input" type="text"
             v-model="userInput"
             placeholder="输入消息 ......" 
             maxlength="32" 
             @keyup.enter="sendMessage"
             style="flex: 1;">
      <div class="ais-SearchBox-submit" @click="sendMessage">
        <svg style="margin-top: 3.5px; margin-left: 18px" viewBox="0 0 1024 1024" width="20" height="20">
          <path
            d="M51.2 508.8c0 256.8 208 464.8 464.8 464.8s464.8-208 464.8-464.8-208-464.8-464.8-464.8-464.8 208-464.8 464.8z"
            fill="#51C492"></path>
          <path
            d="M772.8 718.4c48-58.4 76.8-132.8 76.8-213.6 0-186.4-151.2-337.6-337.6-337.6-186.4 0-337.6 151.2-337.6 337.6 0 186.4 151.2 337.6 337.6 337.6 81.6 0 156-28.8 213.6-76.8L856 896l47.2-47.2-130.4-130.4zM512 776c-149.6 0-270.4-121.6-270.4-271.2S363.2 233.6 512 233.6c149.6 0 271.2 121.6 271.2 271.2C782.4 654.4 660.8 776 512 776z"
            fill="#FFFFFF"></path>
        </svg>
      </div>
    </div>
    
    <button @click="ResetImage" class="generate-button">重置图片</button>
    <button @click="handleGeneratePDF" class="generate-button">生成并展示心脏诊疗报告</button>

  </div>

    <!-- <div>
      <Sider/>
    </div> -->

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElAvatar } from 'element-plus';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FileUpload from '@/components/common/FileUpload.vue';
// import IU from '@/assets/iu.png';
// import HEART from '@/assets/heartomg.gif';
import ShowFile from '@/components/common/ShowFile.vue';
import useDocStore from '@/stores/document.js';   
import SunflowerIcon from '@/assets/Sunflower.png';
import YitaoIcon from '@/assets/yitao.png';
import EliIcon from '@/assets/eli.png'
// import Putao from '@/assets/putao.png'
// 文心
import { ChatService } from '@/api/wenxin';  
import { marked } from 'marked'; 
import { useStore } from 'vuex';
const store = useStore(); 
const visible = computed(() => store.state.visible);
const asideshow = computed(() => store.state.asideshow);
const docStore = useDocStore();  
// Sider
// import Sider from '@/components/common/sider.vue'

// 使用userinfo仓库
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({ ...userInfoStore.info });

// 监听 userInfo 的变化
watch(userInfo, async (newVal, oldVal) => {
  window.location.reload();
}, { deep: true });

const ResetImage = () => {
  docStore.resetImage();
}
// 


// tool
const openedMenus = ref(0); // 当前打开的菜单  
const activeButton = ref(null); 

const cards = [
  {
    id: 1,
    title: 'Upload Image',
    icon: SunflowerIcon, // Use the imported image
    description: "Please upload CT or MR NIfTI images.",
    buttons: []
  },
  {
    id: 2,
    title: 'Files',
    icon: YitaoIcon, // Use the imported image
    description: "Please select a NIfTI image for slicing.",
    buttons: []
  },
  {
    id: 3,
    title: ' Single Segmentation',
    icon: EliIcon, // Use the imported image
    description: "Registration-based Single Sample Segmentation of Cardiac NII Images.",
    buttons: [
      { label: '基于配准的单样本切割', action: 'Action3_1' },
    ]
  },
  {
    id: 4,
    title: 'Total Cardiotomy',
    icon: EliIcon, // Use the imported image
    description: "Detection of cardiac scars using CT NII images.",
    buttons: [
      { label: '全心脏分割', action: 'Action4_1' },
      { label: '下载切割后图像', action: 'Action4_2' }
    ]
  },
  {
    id: 5,
    title: 'Scar Detection',
    icon: EliIcon, // Use the imported image
    description: "Detection of cardiac scars using CT NII images.",
    buttons: [
      { label: '心脏疤痕切割', action: 'Action5_1' },
      { label: '下载切割后图像', action: 'Action5_2' }
    ]
  }
];

const toggleDropdown = (menuId) => {   
  if (openedMenus.value !== menuId) {   
    openedMenus.value = menuId;  
  }  
};  

const isOpen = (menuId) => openedMenus.value === menuId;  

// 模型接口
import { ModelheartsegService,ModelheartscarService,AddFileService } from '@/api/model.js'; // 替换为实际路径  
import useImageStore from '@/stores/images.js'; // 导入Pinia store
const imageStore = useImageStore();

const HeartSegModel = async (serviceName) => {  
  try {  
    const params = {  
      niiUrl: imageStore.niiImgUrl, 
      Service: serviceName,
    };  
    console.log("params : ", params)
    const response = await ModelheartsegService(params);  
    console.log('API Response:', response); 
    if (response.code === 0) {  // 确保响应成功
        const imageUrls = response.data;
        imageUrls.forEach(url => {
            imageStore.addImage(url);
        });
    } else {
        console.error('Error fetching images:', response.message);
    }
  } catch (error) {  
    console.error('Error fetching heart segmentation model:', error);  
  }  
}; 

const HeartScarModel = async (serviceName) => {  
  try {  
    const params = {  
      niiUrl: imageStore.niiImgUrl, 
      Service: serviceName, 
    };  
    console.log("params : ", params)
    const response = await ModelheartscarService(params);  
    console.log('API Response:', response); 
    if (response.code === 0) {  // 确保响应成功
        const imageUrl = response.data;
        console.log("Heart Scar Model imageUrl : ",imageUrl);
    } else {
        console.error('Error fetching images:', response.message);
    }
  } catch (error) {  
    console.error('Error fetching heart segmentation model:', error);  
  }  
}; 

const AddFileByURL = async (fileurl) => {
  const urldata = {
    url: fileurl
  }
  try {
    const response = await AddFileService(urldata);
    console.log('API Response:', response); 
    if (response.code === 0) {  // 确保响应成功
        console.log("data : ",response.data);
    } else {
        console.error('Error fetching  : ', response.message);
    }
  } catch (error){
    console.error('Error  :', error);  
  }
}

// 模型接口 over

const executeAction = async (actionName) => {
  if(actionName === 'Action3_1'){
    await HeartSegModel("segmentation")
  } else if (actionName === "Action4_1"){
    await AddFileByURL("https://aircraft-1111.oss-cn-beijing.aliyuncs.com/4465158c-fd18-4dfc-97ef-25e651367f2b_heartTest.nii.gz");
  }else if(actionName === 'Action5_1'){
    await HeartScarModel("scar_detection")
  }
  
  activeButton.value = actionName;  
  console.log(`${actionName} 执行了！`);  
};  

// tool-over

// userpart
const webInfo = ref({
  avatar: 'https://example.com/avatar.png',
  webName: 'My Website',
  historyAllCount: 123456
});

const articleTotal = ref(100); // Replace with actual logic to get the total articles
const sortInfo = ref([
  { sortName: '分类1', sortDescription: '描述1' },
  { sortName: '分类2', sortDescription: '描述2' }
]);

const articleSearch = ref('');

const isMobile = computed(() => {
  return window.innerWidth <= 768;
});


// userpart-over

// showdiaWindows
const showdiaWindows = () => {
  store.commit('changeVisibility', { segwindows: !visible.value.segwindows });
  toggleDropdown(0);
}

const showWenxin = () => {
  store.commit('changeVisibility', { wenxin: !visible.value.wenxin });
  toggleDropdown(0);
}



onMounted(() => {
  // initThree();  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
  });
});


// 生成诊断报告

const handleGeneratePDF = async () => {
    console.log("generate pdf");   
    await docStore.generatePDF();  
};  



const userInput = ref('');  
const messages = ref([]);  

const sendMessage = async () => {  
  const trimmedMessage = userInput.value.trim();  
  if (trimmedMessage) {  
    messages.value.push({ text: trimmedMessage, isUser: true });  
    userInput.value = ''; 

    try {  
      const response = await ChatService({ question: trimmedMessage });  
      const responseMessage = response.data;  
      const parsedMessage = marked(responseMessage);  
      
      messages.value.push({ text: parsedMessage, isUser: false });  
    } catch (error) {  
      console.error('API 请求失败:', error);  
      messages.value.push({ text: '发送消息失败，请稍后再试。', isUser: false });  
    }  
  }  
};



</script>


<style scoped>
  /*wenxin*/
  .chat-window {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.message-list {
  height: 200px;
  display: flex;
  flex-direction: column;
}

.message {
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  max-width: 100%;
  word-wrap: break-word;
}

.user-message {
  background-color: #d1e7dd;
  align-self: flex-end;
}
/*wenxin over*/


.generate-button {  
    position: relative;      /* 添加位置属性 */  
    margin-top: 5px;       /* 与原样式保持一致的上边距 */  
    background: var(--lightGreen); /* 使用变量颜色 */  
    cursor: pointer;         /* 指针光标 */  
    width: 100%;              /* 设置宽度 */  
    height: 35px;           /* 设置高度 */  
    border-radius: 1rem;    /* 边角圆润 */  
    text-align: center;      /* 文本居中 */  
    line-height: 35px;      /* 行高与高度一致，确保文本垂直居中 */  
    color: var(--white);     /* 使用变量颜色 */  
    overflow: hidden;        /* 设置溢出处理为隐藏 */  
    z-index: 1;              /* 阶层设置 */  
    margin-bottom: 5px;     /* 下边距 */  
    border: none;            /* 去掉边框 */  
    padding: 0;              /* 去掉内边距，使用高度来确定大小 */  
}  

.generate-button:hover {  
    background: #87CEEB;       /* 悬停时背景变为蓝色 */  
}  

  .el-popover {
    z-index: 1000;
  }

  .three-container {  
    background-color:var(--background); /* 设置背景为白色 */  
    width: 300px; /* 可以根据需求调整宽度 */  
    height: 300px; /* 可以根据需求调整高度 */  
    overflow: hidden;  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    position: relative;  
    resize: both; /* 允许水平和垂直方向上的调整 */  
    min-width: 200px; /* 设置最小宽度，防止过小 */  
    min-height: 200px; /* 设置最小高度，防止过小 */ 
    cursor: pointer; 
    margin-bottom: 26px;  
  } 


  /* tool-container */
  .tool-container {  
      background: linear-gradient(-45deg, #cccccc, #d9d9d9, #b3b3b3, #e6e6e6, #bfbfbf);  
      /*background: var(--background);*/
      background-size: 400% 400%;  
      animation: gradientBG 10s ease infinite;  
      display: flex;  
      flex-direction: column;  
      align-items: center;  
      border-radius: 10px;  
      position: relative;  
      overflow: hidden;  
  }
  
  .menu-item {  
      margin-bottom: 5px;  
      border: 2px solid #d3d3d3; 
      border-radius: 10px;  
      transition: border-color 0.3s; 
      box-shadow: none;
      padding: 0px; 
  }  

  .menu-title {   
      background-color: white;  
      transition: background-color 0.3s;
      font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
      font-weight: bold;  
  }

  .selected-title {
    color: blue; 
  }

  .active {  
    border: 2px solid blue; 
  }  

  .button-container {  
      padding: 5px;
      display: flex;  
      flex-direction: column; /* 使按钮按列排列 */  
      align-items: flex-start; /* 可选：左对齐 */   
  }  

  .button-container .el-button {
    margin-left: 0; 
  }

  .button-title {  
      margin-top: 5px;
      width: 100%;
      font-family: Arial, sans-serif;  
      background-color: #EDEEF1;  
      font-weight: normal;  
  }  

  .small-blue-font {
    margin-top: 3px;
    margin-bottom: 3px;
    color: blue; /* 字体颜色 */
    font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
    font-size: 12px; /* 较小的字号 */
    display: flex;
    justify-content: center;
    align-items: center;
  }


  /*tool-style-end*/


  .myAside-container > div:not(:last-child) {
    margin-bottom: 30px;
  }

  .selectSort > div:not(:last-child) {
    margin-bottom: 30px;
  }

  .card-content1 {
    background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
    background-size: 400% 400%;
    animation: gradientBG 10s ease infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }

  .card-content1 :not(:first-child) {
    z-index: 10;
  }

  .web-name {
    font-size: 30px;
    font-weight: bold;
    margin: 20px 0;
  }

  .web-info {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .blog-info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .blog-info-num {
    margin-top: 12px;
  }

  .collection-btn {
    position: relative;
    margin-top: 12px;
    background: var(--lightGreen);
    cursor: pointer;
    width: 65%;
    height: 35px;
    border-radius: 1rem;
    text-align: center;
    line-height: 35px;
    color: var(--white);
    overflow: hidden;
    z-index: 1;
    margin-bottom: 25px;
  }

  .collection-btn::before {
    background: var(--gradualRed);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    transform: scaleX(0);
    transform-origin: 0;
    transition: transform 0.5s ease-out;
    transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
    border-radius: 1rem;
    z-index: -1;
  }

  .collection-btn:hover::before {
    transform: scaleX(1);
  }

  .card-content2-title {
    font-size: 18px;
    margin-bottom: 20px;
    color: var(--lightGreen);
    font-weight: bold;
  }

  .card-content2-icon {
    color: var(--red);
    margin-right: 5px;
    animation: scale 1s ease-in-out infinite;
  }

  .aside-post-detail {
    display: flex;
    cursor: pointer;
  }

  .aside-post-image {
    width: 40%;
    min-height: 50px;
    border-radius: 6px;
    margin-right: 8px;
    overflow: hidden;
    position: relative;
  }

  .error-aside-image {
    background: var(--themeBackground);
    color: var(--white);
    padding: 10px;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .aside-post-title {
    width: 60%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .aside-post-date {
    margin-top: 8px;
    margin-bottom: 20px;
    color: var(--greyFont);
    font-size: 12px;
  }

  .post-sort {
    border-radius: 1rem;
    margin-bottom: 15px;
    line-height: 30px;
    transition: all 0.3s;
  }

  .post-sort:hover {
    background: var(--themeBackground);
    padding: 2px 15px;
    cursor: pointer;
    color: var(--white);
  }

  .sort-name {
    font-weight: bold;
    font-size: 25px;
    margin-top: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sort-name:after {
    top: 74px;
    width: 22px;
    left: 26px;
    height: 2px;
    background: var(--white);
    content: "";
    border-radius: 1px;
    position: absolute;
  }

  .admire-box {
    background: var(--springBg) center center / cover no-repeat;
    padding: 25px;
    border-radius: 10px;
    animation: hideToShow 1s ease-in-out;
  }

  .admire-btn {
    padding: 13px 15px;
    background: var(--maxLightRed);
    border-radius: 3rem;
    color: var(--white);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
    margin: 20px auto 0;
    transition: all 1s;
  }

  .admire-btn:hover {
    transform: scale(1.2);
  }

  .admire-image {
    margin: 0 auto 10px;
    border-radius: 10px;
    height: 150px;
    width: 150px;
    background: var(--admireImage) center center / cover no-repeat;
  }

  .admire-content {
    font-size: 12px;
    color: var(--maxGreyFont);
    line-height: 1.5;
    margin: 5px;
  }

  .ais-SearchBox-input {
    padding: 0 14px;
    height: 30px;
    width: calc(100% - 50px);
    outline: 0;
    border: 2px solid var(--lightGreen);
    border-right: 0;
    border-radius: 40px 0 0 40px;
    color: var(--maxGreyFont);
    background: var(--white);
  }

  .ais-SearchBox-submit {
    height: 30px;
    width: 50px;
    border: 2px solid var(--lightGreen);
    border-left: 0;
    border-radius: 0 40px 40px 0;
    background: var(--white);
    cursor: pointer;
  }

  .hasVideo {
    padding: 2px 10px 0;
    background: var(--maxMaxWhiteMask);
    border-radius: 6px;
  }

</style>
