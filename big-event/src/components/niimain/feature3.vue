<template>
  <section>
    <h1>
      NiiVue supports multiuser image option syncing between publishers and
      subscribers. Clone and run the
      <a href="https://github.com/niivue/niivue-server" target="_blank">niivue-server</a>
      to allow this to work. Open two instances of this page to see multiuser
      synchronization.
    </h1>
    <p>Click the buttons to change the color map</p>
    <div class="slidecontainer">
      Opacity
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
      <button @click="resetSession">Reset Session</button>
    </div>
  </section>
  <section>
    <div id="demo1" style="width: 90%; height: 400px">
      <canvas id="gl1" height="480" width="640"></canvas>
    </div>
  </section>
  <section>
    <p>available color maps:</p>
    <p id="colormaps">
      <button
        v-for="cmap in colormaps"
        :key="cmap"
        @click="changeColormap(cmap)"
      >
        {{ cmap }}
      </button>
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as niivue from '@niivue/niivue'

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
      url: 'https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/mni152.nii.gz',
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
section {
  margin: 20px;
}
</style>
