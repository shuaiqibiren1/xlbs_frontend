App.vue
<template>
<div>
    <!-- loader -->
    <loader :loading="loading">
  

      <template #loader>
        <div>
          <zombie></zombie>
        </div>
      </template>



      <template #body>

        <!-- background -->
        <el-image style="animation: header-effect 2s"
                  class="background-image-index"
                  v-once
                  lazy
                  :src = "bgImage"
                  fit="cover">
          <div slot="error" class="image-slot background-image-index-error"></div>
        </el-image>
        
        <!-- word -->
        <div class="signature-wall myCenter my-animation-hideToShow">
            <h1 class="playful">
            <span v-for="(char, index) in webTitle" :key="index">{{ char }}</span>
            </h1>
            <div class="printer">
            <Printer :printerInfo="printerInfo.content">
                <template #paper="{ content }">
                <h3>
                    {{ content }}<span class="cursor">|</span>
                </h3>
                </template>
            </Printer>
            </div>
            <div id="bannerWave1"></div>
            <div id="bannerWave2"></div>
        </div>


        <!-- content -->
        <div class="page-container-wrap">
          <div class="page-container">
            <div class="aside-content">
              <myAside></myAside>
            </div>

            <div class="recent-posts">
              <div class="announcement background-opacity">
                <i class="fa fa-volume-up" aria-hidden="true"></i>
                  <div>  
                    医生患者交互平台，医生可以为患者添加nii图像，以及评语  
                  </div> 
              </div>

            <div style="padding: 0 20px">
              <CarAnimation />
            </div>

          <!-- 只有医生用户才能看到添加新病人的按钮 -->
          <el-button v-if="userInfo.identity === 'doctor'" @click="showAddPatientDialog = true">
            添加新的病人
          </el-button>

          <!-- 卡片测试代码  -->
          <el-button v-if="userInfo.identity === 'patient'" @click="showDialog = true">
            添加新的图像
          </el-button>
        
          <div v-if="userInfo.identity === 'patient'">
            <ResourceCardList :resourcePathList="resourcePathList" @clickResourcePath="handleResourceClick" />
          </div>

          <CardList
          v-if="userInfo.identity === 'doctor'"
          :cards="cardData"
          @card-click="handleCardClick"
          />

              <div class="container">
                <div>
                  <AvatarUploader v-if="visible.avatar" />
                </div>

                <div>
                  <UserInfoForm v-if="visible.info" />
                </div>

                <div>
                  <ImageDisplay v-if="visible.segwindows" />
                </div>
              </div>

            </div>
          </div>

        </div>




        <!-- myFooter -->
        <div style="background: var(--background)">
            <myFooter :showFooter="true"></myFooter>
        </div>
      </template>
    </loader>


    <!-- 弹窗 -->
    <el-dialog 
      v-model="showDialog"
    >
    <template #title>  
      <span style="color: white;">添加新的图像</span>  
    </template>  

      <div class="upload-center">
        <el-upload
          ref="dialogUploadRef"
          :action="`/api/model/uploadurlbyidm?id=${userInfo.id}`"
          :headers="{'Authorization': tokenStore.token}"
          drag
          list-type="picture-card"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>

      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">确认上传</el-button>
      </template>
    </el-dialog>


    <el-dialog  
      :title="patientInfo ? patientInfo.username : ''"  
      v-model="dialogVisible"  

    > 

    <div style="background-color: white; padding: 10px;"> </div>
      <el-form >
        <el-form-item label="评论" :label-width="formLabelWidth">
          <el-input v-model="patientInfo.comment" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload
            ref="uploadRef"
            :action="uploadUrl"
            :headers="{'Authorization': tokenStore.token}">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

    <div v-if="imagesresult.length">
      <h3>上传的文件</h3>
      <div v-for="(item, index) in imagesresult" :key="item.id" class="card">
        <div class="card-content" @click="toggleEdit(item.id)">
          <p>{{ item.fileName }}</p>
          <el-button type="danger" @click.stop="deleteItem(item.id, index)">删除</el-button>
        </div>
        <div v-if="editingItemId === item.id" class="edit-area">
          <!-- 完善卡片数据的表单 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="item.age" placeholder="年龄" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.sex" placeholder="性别" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.cp" placeholder="总胆固醇" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.trestbps" placeholder="动脉血压测定" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.chol" placeholder="静脉压测定" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.fbs" placeholder="空腹血糖" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.restecg" placeholder="心电图结果" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.thalach" placeholder="心率" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.exang" placeholder="运动时是否心绞痛" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.oldpeak" placeholder="左心房体积" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.ca" placeholder="左心室射血分数" class="input-item"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.thal" placeholder="心肌疤痕/左心房体积比" class="input-item"></el-input>
            </el-col>
          </el-row>
          <el-button type="primary" @click="completeEdit(item)">修改完成</el-button>
        </div>

      </div>
    </div>

      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModification">确认</el-button>
        <el-button type="danger" @click="handleDeletePatient">删除</el-button>
      </template>
      
    </el-dialog>

    <!-- 添加新病人的对话框 -->
    <el-dialog v-model="showAddPatientDialog" title="添加新病人">
      <AddPatient />
    </el-dialog>



</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import myFooter from '@/components/common/myFooter.vue';
import loader from '@/components/common/loader.vue';
import zombie from '@/components/common/zombie.vue';
import myAside from '@/components/myAside.vue';
import bgImage from '@/assets/bgimg5.jpg';
import AvatarUploader from '@/components/common/AvatarUploader.vue';
import UserInfoForm from '@/components/common/UserInfoForm.vue';
import ImageDisplay from '@/components/common/ImageDisplay.vue';
import CarAnimation from '@/components/common/CarAnimation.vue';
import { useStore } from 'vuex';
import CardList from '@/components/cardList.vue'; // 确保路径正确
import { ElDialog, ElButton } from 'element-plus';
import IU from '@/assets/iu.png';
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.js';
import { updateUserCommentService } from '@/api/user.js';
import { filesNameService,deleteFileService } from '@/api/upload.js'
import AddPatient from '@/components/common/AddPatient.vue';
import { deletePatientService } from '@/api/bind.js';
import Printer from '@/components/common/printer.vue';
import { wenxinService } from '@/api/doc.js'

// 病患卡片修改区
const editingItemId = ref(null); // 跟踪正在编辑的卡片 ID

const toggleEdit = (id) => {
  if (editingItemId.value === id) {
    editingItemId.value = null; // 收回编辑区域
  } else {
    editingItemId.value = id; // 显示编辑区域
  }
};

// 完成编辑并发送请求
const completeEdit = async (item) => {
    editingItemId.value = null; // 收回编辑区域

    // 构造请求体
    const message = {
        id: item.id,
        age: item.age,
        sex: item.sex,
        cp: item.cp,
        trestbps: item.trestbps,
        chol: item.chol,
        fbs: item.fbs,
        restecg: item.restecg,
        thalach: item.thalach,
        exang: item.exang,
        oldpeak: item.oldpeak,
        ca: item.ca,
        thal: item.thal
    };

    // 调用API并处理响应
    try {
        const response = await wenxinService(message);
        console.log('Response from server:', response);
    } catch (error) {
        console.error('Failed to upload heart parameters:', error);
    }
};

const store = useStore(); 
const visible = computed(() => store.state.visible);
// patients-infos
import usePatientsInfoStore from '@/stores/patients.js'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({ ...userInfoStore.info });
const patientsInfoStore = usePatientsInfoStore()
const patientsInfos = computed(() => patientsInfoStore.infos)
const dialogVisible = ref(false);
const uploadRef = ref();
const tokenStore = useTokenStore();
// dialog
const patientInfo = ref(null);
const imagesresult = ref([])
const formLabelWidth = ref('150px');

const loading = ref(false);
// 添加新病人的对话框的可见性
const showAddPatientDialog = ref(false);

const uploadUrl = computed(() => {
  return `/api/model/uploadurlbyidm?id=${patientInfo.value.id}`;
});
// dialog over

// 模拟 webTitle 数据
const webTitle = ref('心灵捕手——在乎每颗心'.split(''));

// printerInfo 数据
const printerInfo = ref({
  content: '多模态与单样本双方法切割全心脏，paddleseg-vnet检测心肌瘢痕'
});

// 控制弹窗的显示状态
const showDialog = ref(false);

// 卡片测试代码
import ResourceCardList from '@/components/common/ResourceCardList.vue';
import useFilesInfoStore from '@/stores/files.js'
const filesInfoStore = useFilesInfoStore();
const filesInfo = computed(() => filesInfoStore.infos)

// 页面跳转
import { useRouter } from 'vue-router';
const router = useRouter();


// 函数：检查 URL 并更新 asideshow.user
function checkAndUpdateAsideshow() {
  if (window.location.pathname === '/home') {
    store.commit('changeAsideshow', { user: true ,segtool: false, wenxin: false, cube: true, heart: false });
    store.commit('changeVisibility', { segwindows: false, wenxin: false});
  } else if (window.location.pathname === '/demo'){
    store.commit('changeAsideshow', { user: false ,segtool: true, wenxin: false, cube: false, heart: true});
    store.commit('changeVisibility', { segwindows: true, wenxin: false});
  } else if (window.location.pathname === '/chat'){
    store.commit('changeAsideshow', { user: false ,segtool: false, wenxin: true, cube: false, heart: true});
    store.commit('changeVisibility', { segwindows: false ,wenxin: false});
  }
}
// patients-infos
const loadPatientsInfo = () => {
  if(userInfo.value.identity === 'doctor'){
    patientsInfoStore.fetchInfos()
  }
  
}

// files-infos
const loadfilesInfo = () => {
  filesInfoStore.fetchInfos(userInfo.value.id)
}


// 确认上传的处理函数
const submitUpload = () => {
  // 这里可以添加提交上传的逻辑
  showDialog.value = false;
  setTimeout(() => {  
    window.location.reload();  
  }, 1000); 
};

// 在组件挂载时调用函数
onMounted(() => {
  checkAndUpdateAsideshow();
  // patients-infos
  if(userInfo.value.identity === "doctor"){
    loadPatientsInfo();
    console.log("Get patients details indentity = " + userInfo.value.identity);
  } else {
    loadfilesInfo();
    console.log("Get files details");
  }

});

const cardData = computed(() => {
  return patientsInfos.value.map((info, index) => ({
    id: info.id,
    avatarSrc: info.userPic || IU,  // 这里假设所有卡片使用相同的图片
    title: `${info.username} (${info.nickname})`,
    description: `📸Comment : ${info.comment}`
  }))
})

// 查找 id 为 ? 的患者信息
const findPatientInfo = (id) => {
  const info = patientsInfos.value.find(info => info.id === id);
  patientInfo.value = info || null;
};

function handleCardClick(id) {
  console.log('Card clicked with ID:', id);
  findPatientInfo(id)
  dialogVisible.value = true; // 显示弹窗
  console.log("dialogVisible : " + dialogVisible.value)
  getFilesName();
}

const updateComment = () => {
  if (patientInfo.value) {
    const data = {
      id: patientInfo.value.id,
      comment: patientInfo.value.comment
    };

    updateUserCommentService(data)
      .then(response => {
        console.log('Update successful:', response);
        dialogVisible.value = false;
      })
      .catch(error => {
        console.error('Update failed:', error);
      });
  }
};


const getFilesName = async () => {
  const patientId = {
    id: patientInfo.value.id
  };

  console.log("Patient ID:", patientId); 

  try {
    const result = await filesNameService(patientId);
    if (result.code === 0) {
      imagesresult.value = result.data;
      console.log(result.data);
      console.log("imagesresult.value : "+imagesresult.value);
    } else {
      console.error('Error fetching files:', result.message);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    console.log("Patient ID:", patientId);
  }
};

const deleteItem = async (id, index) => {
  const data = {
    fileId: id
  };

  try {
    const result = await deleteFileService(data);
    if (result.code === 0) {
      imagesresult.value.splice(index, 1);
      console.log(result.message);
    } else {
      console.error('Error deleting file:', result.message);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  getFilesName();
};



const confirmModification = () => {
  // 在此处添加确认操作的逻辑
  console.log('修改已确认');
  dialogVisible.value = false;
  updateComment();
  ElMessage.success('修改成功');
};

const deletePatient = async() => {
  try{
    const response = await deletePatientService({id : patientInfo.value.id})
    if (response.code === 0) {
      ElMessage.success('删除成功');
    } else {
      console.error('删除失败', response.message);
    }
  } catch (error) {
    console.error('删除病人时发生错误', error);
  }
}

// 处理删除病人的逻辑
const handleDeletePatient = () => {
  // 删除病人的逻辑
  console.log('删除病人', patientInfo.value.id);

  deletePatient();
  window.location.reload();
  // 在这里添加你的删除病人的逻辑，比如调用 API 或更新状态
  dialogVisible.value = false; // 关闭对话框
};

// 卡片测试代码

const resourcePathList = computed(() => {
  return filesInfo.value.map((info, index) => ({
    cover: info.url ? info.url : 'https://aircraft-1111.oss-cn-beijing.aliyuncs.com/mr_train_1001_middle_slice.jpg',
    // cover: info.url,
    title: info.fileName,
    introduction: '一个 nii 图像',
    recommendStatus: true,
    createTime: '2024-08-15T00:00:00Z',
    url: '/demo',
    id: info.id
  }))
})
// associatedId，fileName，id，url
import useImageStore from '@/stores/images.js'; // 导入Pinia store
const imageStore = useImageStore();


// 需要修改
async function handleResourceClick(id) {
  console.log('Clicked image id:', id);

  imageStore.setImgId(id);   // 设置图片ID
  
  await imageStore.fetchImages(id);  // 等待获取图片完成
  
  router.push('/demo');  // 获取图片后跳转到/demo路由
}

</script>





<style scoped>

  .edit-area {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    background-color: #f9f9f9;
  }

  .input-item {
    margin-bottom: 10px;
  }

  .el-col {
    padding-bottom: 10px;
  }

  .upload-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* 根据需要调整高度 */
  }

  .card {
    border: 1px solid #ebeef5;
    padding: 14px;
    margin-top: 10px;
    border-radius: 4px;
  }

  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 主体内容 */
  .container {
    width: 100%; /* 可以根据需要调整 */
    display: flex;
    flex-direction: column;
    gap: 20px; /* 控制上下组件之间的间距 */
  }
  /* 主题内容 end */

  .background-image-index {
    width: 100vw;
    height: 50vh;
    position: fixed;
    z-index: -1;
  }

  .background-image-index::before {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
    content: '';
  }

  .background-image-index-error {
    background-color: var(--lightGreen);
    width: 100vw;
    height: 50vh;
    position: fixed;
    z-index: -1;
  }

  .signature-wall {
    /* 向下排列 */
    display: flex;
    flex-direction: column;
    position: relative;
    user-select: none;
    height: 50vh;
    overflow: hidden;
  }

  .playful {
    color: var(--white);
    font-size: 40px;
  }

  .sort-article-first {
    margin: 40px auto 20px;
    display: flex;
    justify-content: space-between;
    color: var(--greyFont);
    border-bottom: 1px dashed var(--lightGray);
    padding-bottom: 5px;
  }

  .article-more {
    cursor: pointer;
    transition: all 0.3s;
  }

  .article-more:hover {
    color: var(--lightGreen);
    font-weight: 700;
    transform: scale(1.1);
  }

  .printer {
    cursor: pointer;
    color: var(--white);
    background: var(--translucent);
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  #bannerWave1 {
    height: 84px;
    background: var(--bannerWave1);
    position: absolute;
    width: 200%;
    bottom: 0;
    z-index: 10;
    animation: gradientBG 120s linear infinite;
  }

  #bannerWave2 {
    height: 100px;
    background: var(--bannerWave2);
    position: absolute;
    width: 400%;
    bottom: 0;
    z-index: 5;
    animation: gradientBG 120s linear infinite;
  }

  /* 光标 */
  .cursor {
    margin-left: 1px;
    animation: hideToShow 0.7s infinite;
    font-weight: 200;
  }

  .el-icon-arrow-down {
    font-size: 40px;
    font-weight: bold;
    color: var(--white);
    position: absolute;
    bottom: 60px;
    animation: my-shake 1.5s ease-out infinite;
    z-index: 15;
    cursor: pointer;
  }

  .page-container-wrap {
    background: var(--background);
    position: relative;
  }

  .page-container {
    display: flex;
    justify-content: center;
    width: 90%;
    padding: 0 20px 40px 20px;
    margin: 0 auto;
    flex-direction: row;
  }

  .recent-posts {
    width: 70%;
  }

  .announcement {  
      padding: 22px;  
      border: 1px dashed var(--lightGray);  
      color: var(--greyFont);  
      border-radius: 10px;  
      display: flex;  
      margin: 40px auto;  
      align-items: center;  
      justify-content: center; /* 使内容在主轴上居中 */  
  }  

  .announcement i {  
      color: var(--themeBackground);  
      font-size: 22px;  
      margin-right: 20px; /* 右边留出空间 */  
      animation: scale 0.8s ease-in-out infinite;  
  }  

  .announcement div {  
      line-height: 30px;  
      text-align: center; /* 使文本在div中居中 */  
  }

  .aside-content {
    width: calc(30% - 40px);
    user-select: none;
    margin-top: 40px;
    margin-right: 40px;
    max-width: 300px;
    float: right;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }

  .push-title {
    font-weight: bold;
    font-size: 20px;
  }

  .push-el-image {
    width: 80%;
    min-height: 100px;
    max-height: 400px;
    border-radius: 15px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .push-button {
    position: relative;
    background: var(--lightGreen);
    cursor: pointer;
    width: 230px;
    border-radius: 2rem;
    line-height: 35px;
    color: var(--white);
  }

  .push-button-title {
    margin-left: 20px;
    font-weight: bold;
  }

  .push-button-car {
    position: absolute;
    margin-left: 55px;
    animation: passing 4s linear infinite;
  }
  
  .dialog-footer {
  text-align: right;
  }

  .cd-top {
    background: var(--toTop) no-repeat center;
    position: fixed;
    right: 5vh;
    top: -900px;
    z-index: 99;
    width: 70px;
    height: 900px;
    background-size: contain;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
  }


  @media screen and (max-width: 1100px) {
    .recent-posts {
      width: 100%;
    }

    .page-container {
      width: 100%;
    }
  }

  @media screen and (max-width: 1000px) {

    .page-container {
      /* 文章栏与侧标栏垂直排列 */
      flex-direction: column;
    }

    .aside-content {
      width: 100%;
      max-width: unset;
      float: unset;
      margin: 40px auto 0;
    }
  }

  @media screen and (max-width: 768px) {

    h1 {
      font-size: 35px;
    }
  }
</style>

