<template>
  <div class="card-content shadow-box-mini" @click="handleClick">
    <div>
      <el-avatar :size="avatarSize" :src="avatarSrc"></el-avatar>
    </div>
    <div class="card-right">
      <div class="card-title">{{ title }}</div>
      <div class="card-desc">{{ description }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  avatarSize: {
    type: Number,
    default: 100
  },
  avatarSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '时光相册'
  },
  description: {
    type: String,
    default: '📸记录美好瞬间'
  },
  clickValue: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits();

function handleClick() {
  emit('card-click', props.clickValue);
}
</script>

<style scoped>
.card-content {
  display: flex;
  padding: 25px;
  margin: 25px 0;
  border-radius: 20px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--background);
}

.card-content:hover {
  /* Add hover effects if needed */
}

.card-right {
  margin-left: 20px;
}

.card-title {
  font-size: 1.6rem;
  letter-spacing: 0.2rem;
  line-height: 3.5rem;
  font-weight: 700;
}

.card-desc {
  font-size: 1.1rem;
  letter-spacing: 0.2rem;
  color: #777777;
}
</style>
