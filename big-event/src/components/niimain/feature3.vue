<template>
  <div class="content">
    <h1>
      可用于展示多模态全心脏切割后的效果
    </h1>
    <div class="slidecontainer">
      <label>Opacity</label>
      <input
        type="range"
        min="0.0"
        max="1.0"
        step="0.1"
        v-model="opacity"
        @input="updateOpacity"
      />
    </div>
    <div>
      <button class="primary-button" @click="resetSession">Reset Session</button>
    </div>

    <div id="demo1" class="canvas-container">
      <canvas id="gl1" height="480" width="640"></canvas>
    </div>

    <p>Available color maps:</p>
    <div id="colormaps" class="colormap-buttons">
      <button
        v-for="cmap in colormaps"
        :key="cmap"
        class="colormap-button"
        @click="changeColormap(cmap)"
      >
        {{ cmap }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as niivue from '@niivue/niivue'
import useImageStore from '@/stores/images.js'; 

const imageStore = useImageStore();

const opacity = ref(1.0)
const colormaps = ref([])

let nv1

const updateOpacity = () => {
  nv1.volumes[0].opacity = opacity.value
  nv1.updateGLVolume()
}

const resetSession = () => {
  localStorage.clear()
}

const changeColormap = (cmap) => {
  nv1.volumes[0].colormap = cmap
  nv1.updateGLVolume()
}

onMounted(async () => {
  const volumeList1 = [
    {
      // url: 'https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/mni152.nii.gz',
      url: imageStore.niiImgUrl,
      colormap: 'gray',
      opacity: 1,
      visible: true,
    },
  ]

  nv1 = new niivue.Niivue()
  nv1.attachTo('gl1')
  await nv1.loadVolumes(volumeList1)
  nv1.setSliceType(nv1.sliceTypeMultiplanar)

  const controller = new niivue.NVController(nv1)
  controller.connectToSession('imageoptions')

  colormaps.value = nv1.colormaps()
})
</script>

<style scoped>

.content {
  margin: 20px;
  padding: 20px;
  /* background-color: #f7f7f7;*/
  background-color: var(--background);
  color: var(--fontColor);
  border-radius: 10px;
}

h1 {  
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  
  font-size: 1.5em;  
  color: #777; /* 更灰的颜色 */  
  margin-bottom: 10px;  
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

p {
  font-size: 1em;
  /*color: #555;*/
  margin-top: 20px;
}

.slidecontainer {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

label {
  font-size: 1em;
  color: #333;
  margin-right: 10px;
}

input[type="range"] {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #ddd;
  outline: none;
  border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
}

.primary-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
}

.primary-button:hover {
  background-color: #0056b3;
}

.canvas-container {
  width: 100%;
  height: 400px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}


.colormap-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.colormap-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif; /* 应用Poppins字体 */
}

.colormap-button:hover {
  background-color: #5d82e0;
}

.colormap-button:active {
  background-color: #004085;
  transform: scale(0.98);
}

</style>
