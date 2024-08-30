<template>
  <div class="container">
    <canvas id="gl" width="640" height="640"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Niivue, SHOW_RENDER } from '@niivue/niivue';

onMounted(() => {
  const volumeList = [
    { url: "https://niivue.github.io/niivue-demo-images/mni152.nii.gz" },
  ];
  const nv = new Niivue({
    isResizeCanvas: true,  // 使 canvas 根据窗口大小自动调整
    show3Dcrosshair: true, // 显示3D十字线
    showCurrentTimepoint: true,
  });

   // 将 NiiVue 实例附加到 canvas 上
  nv.attachTo("gl");

  // 加载 NIfTI 图像
  nv.loadVolumes(volumeList);
});
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
