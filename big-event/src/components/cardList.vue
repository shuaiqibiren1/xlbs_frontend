<template>
  <div class="card-list">
    <CardComponent
      v-for="(card, index) in cards"
      :key="index"
      :avatarSrc="card.avatarSrc"
      :title="card.title"
      :description="card.description"
      @card-click="handleCardClick(card.id)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import CardComponent from '@/components/common/userCard.vue'; // 确保路径正确

const props = defineProps({
  cards: {
    type: Array,
    required: true
  }
});

const emit = defineEmits();

function handleCardClick(id) {
  emit('card-click', id);
}
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
