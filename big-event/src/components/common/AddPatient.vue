<!-- components/AddPatient.vue -->
<template>
  <div class="add-patient-container">
    <el-input
      v-model="newPatientName"
      placeholder="请输入新病人姓名"
      class="input-new-patient"
    ></el-input>
    <el-button type="primary" @click="handleAddPatient" class="add-patient-button">
      添加新病人
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { bindDPService } from '@/api/bind.js';
import { ElMessage } from 'element-plus'

const emit = defineEmits(['add-patient']);
const newPatientName = ref('');

const handleAddPatient = async () => {
  if (newPatientName.value.trim() === '') {
    console.error('病人姓名不能为空');
    return;
  }
  try {
    const response = await bindDPService({ patientName: newPatientName.value });
    if (response.code === 0) {
      // 发出添加新病人的事件，传递新病人姓名
      emit('add-patient', newPatientName.value);
      ElMessage.success('添加成功');
      window.location.reload();
      // 清空输入框
      newPatientName.value = '';
    } else {
      console.error('添加新病人失败', response.message);
    }
  } catch (error) {
    console.error('添加新病人时发生错误', error);
  }
};
</script>

<style scoped>
.add-patient-container {
  display: flex;
  align-items: center;
  font-family: "SimSun", "宋体", serif;
}

.input-new-patient {
  margin-right: 10px;
}

.add-patient-button {
  margin-left: 10px;
}
</style>
