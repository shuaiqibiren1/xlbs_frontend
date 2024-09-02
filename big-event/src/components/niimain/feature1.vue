<template>
  <div class="content">
    <!-- Header 部分 -->
    <header class="header">
      <div class="controls">
        <select v-model="sliceType" @change="setSliceType">
          <option value="4">Render</option>
          <option value="3">A+C+S+R</option>
        </select>
        <button @click="saveAsHtml">Save as HTML</button>
      </div>
      <div class="checkbox-group">
        <label for="check1">Background</label>
        <input type="checkbox" id="check1" v-model="backgroundChecked" @click="updateBackground" />
        <label for="check2">Mask</label>
        <input type="checkbox" id="check2" v-model="maskChecked" @click="updateMask" />
        <label for="check3">Smooth</label>
        <input type="checkbox" id="check3" v-model="smoothChecked" @click="updateSmooth" />
      </div>
      <div class="opacity-slider">
        <label for="alphaSlider">Opacity</label>
        <input type="range" min="1" max="255" v-model="alphaSliderValue" @input="updateOpacity" class="slider" id="alphaSlider" />
      </div>
    </header>

    <!-- Main 部分 -->
    <main class="main">
      <canvas id="gl1"></canvas>
    </main>

    <!-- Footer 部分 -->
    <footer class="footer">
      <label id="location">{{ location }}</label>
      <div class="script-container">
        <textarea v-model="scriptText" name="customText" rows="8" cols="60">
          let cmap = {
            R: [0, 0, 120, 175],
            G: [0, 90, 60, 185],
            B: [0, 120, 60, 175],
            labels: ["air", "CSF", "gray", "white"],
          };
        </textarea>
        <button @click="applyScript">Apply</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as niivue from '@niivue/niivue';
import useImageStore from '@/stores/images.js'; 

const imageStore = useImageStore();

const sliceType = ref(3);
const backgroundChecked = ref(true);
const maskChecked = ref(false);
const smoothChecked = ref(true);
const alphaSliderValue = ref(127);
const scriptText = ref(`let cmap = {
  R: [0, 0, 120, 175],
  G: [0, 90, 60, 185],
  B: [0, 120, 60, 175],
  labels: ["air", "CSF", "gray", "white"],
};`);
const location = ref('');

let nv1;

const handleLocationChange = (data) => {
  location.value = data.string;
};

const saveAsHtml = () => {
  nv1.saveHTML('labels.html', 'gl1', decodeURIComponent(esm));
};

const setSliceType = () => {
  nv1.setSliceType(parseInt(sliceType.value));
};

const updateOpacity = () => {
  nv1.setOpacity(1, alphaSliderValue.value / 255);
};

const updateBackground = () => {
  nv1.volumes[0].opacity = backgroundChecked.value;
  nv1.updateGLVolume();
};

const updateMask = () => {
  nv1.isAlphaClipDark = maskChecked.value;
  nv1.updateGLVolume();
};

const updateSmooth = () => {
  nv1.setInterpolation(!smoothChecked.value);
};

const applyScript = () => {
  let val = scriptText.value;
  val += ';nv1.volumes[1].setColormapLabel(cmap);nv1.updateGLVolume();';
  eval(val);
};

onMounted(async () => {
  nv1 = new niivue.Niivue({
    logging: false,
    dragAndDropEnabled: true,
    backColor: [0.3, 0.3, 0.3, 1],
    show3Dcrosshair: true,
    onLocationChange: handleLocationChange,
  });

  nv1.setRadiologicalConvention(false);
  nv1.attachTo('gl1');

  const volumeList1 = [
    {
      url: imageStore.niiImgUrl,
      colormap: 'red',
    },
    {
      url: imageStore.niiImgUrl,
      colormap: 'green',
      opacity: 0.5,
    },
  ];

  await nv1.loadVolumes(volumeList1);
  nv1.opts.multiplanarShowRender = niivue.SHOW_RENDER.ALWAYS;
  nv1.setSliceType(nv1.sliceTypeMultiplanar);
  nv1.graph.autoSizeMultiplanar = true;
  nv1.updateGLVolume();
  applyScript();
});
</script>

<style scoped>
.content {
  margin: 20px;
  padding: 20px;
  background-color: var(--background);
  color: var(--fontColor);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh; /* 使用整个视口的高度 */
}

.header, .footer {
  background-color: var(--headerFooterBackground);
  padding: 15px;
  border-radius: 8px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.opacity-slider {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main {
  /* background-color: var(--mainBackground); */
  padding: 15px;
  border-radius: 8px;
  flex-grow: 1; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.script-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  width: 150px;
}
</style>
