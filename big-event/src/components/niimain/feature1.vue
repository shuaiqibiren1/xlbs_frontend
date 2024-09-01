<template>
  <div class="scaled-container">
    <div class="content-wrapper">
      <header>
        <select v-model="sliceType" @change="setSliceType">
          <option value="4">Render</option>
          <option value="3">A+C+S+R</option>
        </select>
        Save the current scene as HTML
        <button @click="saveAsHtml">Save as HTML</button>

        <label for="check1">Background</label>
        <input type="checkbox" id="check1" v-model="backgroundChecked" @click="updateBackground" />
        <label for="check2">Mask</label>
        <input type="checkbox" id="check2" v-model="maskChecked" @click="updateMask" />
        <label for="check3">Smooth</label>
        <input type="checkbox" id="check3" v-model="smoothChecked" @click="updateSmooth" />
        <label for="alphaSlider">Opacity</label>
        <input type="range" min="1" max="255" v-model="alphaSliderValue" @input="updateOpacity" class="slider" id="alphaSlider" />
      </header>

      <main>
        <canvas id="gl1"></canvas>
      </main>

      <footer>
        <label id="location">&nbsp;&nbsp;{{ location }}</label>
        <p>
          <textarea v-model="scriptText" name="customText" rows="8" cols="60">
            let cmap = {
              R: [0, 0, 120, 175],
              G: [0, 90, 60, 185],
              B: [0, 120, 60, 175],
              labels: ["air", "CSF", "gray", "white"],
            };
          </textarea>
          <button @click="applyScript">Apply</button>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as niivue from '@niivue/niivue';

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
      url: 'https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/heart2.nii.gz',
      colormap: 'red',
    },
    {
      url: 'https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/heart2.nii.gz',
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
/* Container that keeps the aspect ratio */
.scaled-container {
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  position: relative;
}

/* Wrapper for content that scales to the container */
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top left;
  background: white;
}

.slider {
  width: 100px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
