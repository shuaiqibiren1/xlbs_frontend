<template>
  <div>
    <header>
      <div class="dropdown" v-for="(menu, index) in menus" :key="index">
        <button class="dropbtn">
          {{ menu.title }}
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <a
            v-for="(item, idx) in menu.items"
            :key="idx"
            :id="item.id"
            :class="{ 'dropdown-item-checked': item.checked }"
            class="viewBtn"
            @click="onButtonClick($event)"
            :accesskey="item.accesskey"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </header>
    <main id="container">
      <canvas id="gl1"></canvas>
    </main>
    <footer id="intensity">&nbsp;</footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as niivue from "@niivue/niivue";

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

const menus = ref([
  {
    title: "File",
    items: [
      { id: "SaveDraw", label: "Save Drawing ^S", accesskey: "s" },
      { id: "SaveBitmap", label: "Screen Shot" },
      { id: "ShowHeader", label: "Show Header" },
      { id: "About", label: "About" }
    ]
  },
  {
    title: "Edit",
    items: [
      { id: "Undo", label: "Undo Draw ^Z", accesskey: "z" }
    ]
  },
  // Add other menus following the same structure
]);

let nv1;
let isFilled = true;

function handleIntensityChange(data) {
  document.getElementById("intensity").innerHTML = "&nbsp;&nbsp;" + data.string;
}

onMounted(async () => {
  nv1 = new niivue.Niivue({
    logging: true,
    dragAndDropEnabled: true,
    backColor: [0, 0, 0, 1],
    show3Dcrosshair: true,
    onLocationChange: handleIntensityChange,
  });
  nv1.opts.isColorbar = false;
  nv1.setRadiologicalConvention(false);
  nv1.attachTo("gl1");
  nv1.setClipPlane([0.3, 270, 0]);
  nv1.setRenderAzimuthElevation(120, 10);
  nv1.setSliceType(nv1.sliceTypeMultiplanar);
  nv1.setSliceMM(true);
  nv1.drawOpacity = 0.5;
  nv1.opts.isColorbar = false;
  const volumeList1 = [{ url: "https://cdn.jsdelivr.net/gh/Aircraft-carrier/PicGOO/images/heart2.nii.gz" }];
  await nv1.loadVolumes(volumeList1);
  nv1.setInterpolation(true);
  nv1.opts.dragMode = nv1.dragModes.slicer3D;
  const cmap = {
    R: [0, 255, 0],
    G: [0, 20, 0],
    B: [0, 20, 80],
    A: [0, 255, 255],
    labels: ["", "white-matter", "delete T1"],
  };
  nv1.setDrawColormap(cmap);
});

function toggleGroup(id) {
  let buttons = document.getElementsByClassName("viewBtn");
  let char0 = id.charAt(0);
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].id.charAt(0) !== char0) continue;
    buttons[i].classList.remove("dropdown-item-checked");
    if (buttons[i].id === id) buttons[i].classList.add("dropdown-item-checked");
  }
}

function onButtonClick(event) {
  const id = event.target.id;

  switch (id) {
    case "SaveDraw":
      nv1.saveImage({ filename: "draw.nii", isSaveDrawing: true });
      break;
    case "SaveBitmap":
      nv1.saveScene("ScreenShot.png");
      break;
    case "ShowHeader":
      alert(nv1.volumes[0].hdr.toFormattedString());
      break;
    case "Colorbar":
      nv1.opts.isColorbar = !nv1.opts.isColorbar;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
      break;
    case "Radiological":
      nv1.opts.isRadiologicalConvention = !nv1.opts.isRadiologicalConvention;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
      break;
    case "Crosshair":
      nv1.opts.show3Dcrosshair = !nv1.opts.show3Dcrosshair;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
      break;
    case "ClipPlane":
      if (nv1.scene.clipPlaneDepthAziElev[0] > 1) nv1.setClipPlane([0.3, 270, 0]);
      else nv1.setClipPlane([2, 270, 0]);
      nv1.drawScene();
      break;
    case "Undo":
      nv1.drawUndo();
      break;
    default:
      if (id.charAt(0) === "@") {
        nv1.setDrawingEnabled(id !== "@Off");
        if (id === "@Erase") nv1.setPenValue(0, isFilled);
        if (id === "@Red") nv1.setPenValue(1, isFilled);
        if (id === "@Blue") nv1.setPenValue(2, isFilled);
        if (id === "@Cluster") nv1.setPenValue(-0, isFilled);
        if (id === "@GrowCluster") nv1.setPenValue(NaN, isFilled);
        if (id === "@GrowClusterBright") nv1.setPenValue(Number.POSITIVE_INFINITY, isFilled);
        if (id === "@GrowClusterDark") nv1.setPenValue(Number.NEGATIVE_INFINITY, isFilled);
        toggleGroup(id);
      } else if (id === "Growcut") {
        nv1.drawGrowCut();
      } else if (id === "Translucent") {
        nv1.drawOpacity = nv1.drawOpacity > 0.75 ? 0.5 : 1.0;
        nv1.drawScene();
        event.srcElement.classList.toggle("dropdown-item-checked");
      } else if (id === "DrawOtsu") {
        const levels = parseInt(prompt("Segmentation classes (2..4)", "3"));
        nv1.drawOtsu(levels);
      } else if (id === "RemoveHaze") {
        const level = parseInt(prompt("Remove Haze (1..5)", "5"));
        nv1.removeHaze(level);
      } else if (id === "DrawFilled") {
        isFilled = !isFilled;
        nv1.setPenValue(nv1.opts.penValue, isFilled);
        event.srcElement.classList.toggle("dropdown-item-checked");
      }
  }
}
</script>

<style scoped>
@import url('niivue.css');

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
}

.viewBtn.dropdown-item-checked {
  background-color: #d3d3d3;
}
</style>
