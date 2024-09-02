<!-- <template>
  <div class="container">
    <header class="header">
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
    <main class="main">
      <canvas id="gl1"></canvas>
    </main>
    <footer class="footer" id="intensity">&nbsp;</footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as niivue from "@niivue/niivue";
import useImageStore from '@/stores/images.js'; 

const imageStore = useImageStore();

const menus = ref([
  { 
    label: 'File', 
    items: [
      { id: 'SaveDraw', label: 'Save Drawing ^S' },
      { id: 'SaveBitmap', label: 'Screen Shot' },
      { id: 'ShowHeader', label: 'Show Header' },
      { id: 'About', label: 'About', href: 'https://www.youtube.com/watch?v=AR83_Bt04VQ&t=1867s&ab_channel=Freesurfer' }
    ] 
  },
  {
    label: 'Edit', 
    items: [
      { id: 'Undo', label: 'Undo Draw ^Z' }
    ]
  },
  {
    label: 'View', 
    items: [
      { id: '|Axial', label: 'Axial' },
      { id: '|Sagittal', label: 'Sagittal' },
      { id: '|Coronal', label: 'Coronal' },
      { id: '|Render', label: 'Render' },
      { id: '|MultiPlanar', label: 'A+C+S', checked: true },
      { id: '|MultiPlanarRender', label: 'A+C+S+R' },
      { id: 'Colorbar', label: 'Colorbar', checked: true },
      { id: 'Radiological', label: 'Radiological' },
      { id: 'Crosshair', label: 'Render Crosshair', checked: true },
      { id: 'ClipPlane', label: 'Render Clip Plane' },
      { id: 'WorldSpace', label: 'World Space' },
      { id: 'Interpolate', label: 'Smooth Interpolation' },
      { id: 'RemoveHaze', label: 'Remove Haze' },
      { id: 'Left', label: 'Left' },
      { id: 'Right', label: 'Right' },
      { id: 'Anterior', label: 'Anterior' },
      { id: 'Posterior', label: 'Posterior' },
      { id: 'Inferior', label: 'Inferior' },
      { id: 'Superior', label: 'Superior' }
    ]
  },
  {
    label: 'Draw',
    items: [
      { id: '@Off', label: 'Off ^0', checked: true },
      { id: '@Red', label: 'Red (edit white matter) ^1' },
      { id: '@Blue', label: 'Blue (edit T1 scan) ^2' },
      { id: '@Erase', label: 'Erase ^7' },
      { id: '@Cluster', label: 'Erase Cluster ^8' },
      { id: '@GrowCluster', label: 'Grow Cluster' },
      { id: '@GrowClusterDark', label: 'Grow Cluster Dark' },
      { id: '@GrowClusterBright', label: 'Grow Cluster Bright' },
      { id: 'DrawFilled', label: 'Fill Outline ^F', checked: true },
      { id: 'DrawOverwrite', label: 'Pen Overwrites Existing ^O', checked: true },
      { id: 'Translucent', label: 'Translucent ^T', checked: true },
      { id: 'Growcut', label: 'Grow Cut' },
      { id: 'DrawOtsu', label: 'Otsu' }
    ]
  },
  {
    label: 'Drag',
    items: [
      { id: '^contrast', label: 'Contrast' },
      { id: '^measurement', label: 'Measurement' },
      { id: '^pan', label: 'Pan/Zoom' },
      { id: '^slicer3D', label: 'Slicer3D', checked: true },
      { id: '^none', label: 'None' }
    ]
  }
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
  const volumeList1 = [{ url: imageStore.niiImgUrl }];
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
.container {
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


.header {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.main {
  flex-grow: 1; /* Occupy the remaining space */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}


.footer {
  padding: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 12px 12px;
  background-color: #404040;
  font-family: inherit;
  margin: 0;
}
.dropdown:hover .dropbtn {
  background-color: #9a9;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #303030;
  min-width: 160px;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-content a {
  float: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  line-height: 6px;
}
.dropdown-content a:hover {
  background-color: #aba;
}
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-item-checked::before {
  position: absolute;
  left: 0.2rem;
  content: "\2022"; /* or '✓' */
  font-weight: 600;
}

.viewBtn.dropdown-item-checked {
  background-color: #d3d3d3;
}
</style> -->

<!-- 
<template>
  <div class="container">
  <header>
    <div class="dropdown" v-for="menu in menus" :key="menu.name">
      <button class="dropbtn">
        {{ menu.name }}
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a v-for="item in menu.items" :key="item.id" class="viewBtn" :id="item.id" @click="onButtonClick">
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
import { ref, onMounted } from 'vue'
import * as niivue from "@niivue/niivue";

// Dropdown menu structure
const menus = [
  {
    name: "File",
    items: [
      { id: "SaveDraw", label: "Save Drawing ^S" },
      { id: "SaveBitmap", label: "Screen Shot" },
      { id: "ShowHeader", label: "Show Header" },
      { id: "About", label: "About" },
    ],
  },
  {
    name: "Edit",
    items: [{ id: "Undo", label: "Undo Draw ^Z" }],
  },
  // Add other menus here following the same structure...
];

let nv1;
let isFilled = ref(true);

const handleIntensityChange = (data) => {
  document.getElementById("intensity").innerHTML =
    "&nbsp;&nbsp;" + data.string;
}

const onButtonClick = async (event) => {
  const id = event.target.id;
  switch (id) {
    case "SaveDraw":
      nv1.saveImage({ filename: 'draw.nii', isSaveDrawing: true });
      break;
    case "SaveBitmap":
      nv1.saveScene("ScreenShot.png");
      break;
    case "ShowHeader":
      alert(nv1.volumes[0].hdr.toFormattedString());
      break;
    // Handle other cases...
  }
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
</script>

<style>
/* Add your styles here, or import the existing stylesheet */

.container {
  font-family: system-ui, Arial, Helvetica, sans-serif;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  background-color: var(--background);
  color: var(--fontColor);
}


main {
  flex: 1;
  background: #000000;
  position: relative;
}


.footer {
  margin: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 12px 12px;
  background-color: #404040;
  font-family: inherit;
  margin: 0;
}

.dropdown:hover .dropbtn {
  background-color: #9a9;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #303030;
  min-width: 160px;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  line-height: 6px;
}

.dropdown-content a:hover {
  background-color: #aba;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item-checked::before {
  position: absolute;
  left: 0.2rem;
  content: "\2022"; /* or '✓' */
  font-weight: 600;
}



</style> -->
<template>
  <header>
  <div class="drop-container">
    <div class="dropdown">
      <button class="dropbtn">
        File
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a class="viewBtn" id="SaveDraw" accesskey="s">Save Drawing ^S</a>
        <a class="viewBtn" id="SaveBitmap">Screen Shot</a>
        <a class="viewBtn" id="ShowHeader">Show Header</a>
        <a
          class="linker"
          href="https://www.youtube.com/watch?v=AR83_Bt04VQ&t=1867s&ab_channel=Freesurfer"
        >
          About
        </a>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">
        Edit
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a class="viewBtn" id="Undo" accesskey="z">Undo Draw ^Z</a>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn" data-toggle="dropdown">
        View
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a href="#" class="viewBtn" id="|Axial">Axial</a>
        <a class="viewBtn" id="|Sagittal">Sagittal</a>
        <a class="viewBtn" id="|Coronal">Coronal</a>
        <a class="viewBtn" id="|Render">Render</a>
        <a class="viewBtn dropdown-item-checked" id="|MultiPlanar">A+C+S</a>
        <a class="viewBtn" id="|MultiPlanarRender">A+C+S+R</a>
        <a class="viewBtn divider dropdown-item-checked" id="Colorbar">Colorbar</a>
        <a class="viewBtn" id="Radiological">Radiological</a>
        <a class="viewBtn dropdown-item-checked" id="Crosshair">Render Crosshair</a>
        <a class="viewBtn" id="ClipPlane">Render Clip Plane</a>
        <a class="viewBtn dropdown-item-checked" id="WorldSpace">World Space</a>
        <a class="viewBtn" id="Interpolate">Smooth Interpolation</a>
        <a class="viewBtn" id="RemoveHaze">Remove Haze</a>
        <a class="viewBtn divider" id="Left">Left</a>
        <a class="viewBtn" id="Right">Right</a>
        <a class="viewBtn" id="Anterior">Anterior</a>
        <a class="viewBtn" id="Posterior">Posterior</a>
        <a class="viewBtn" id="Inferior">Inferior</a>
        <a class="viewBtn" id="Superior">Superior</a>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">
        Draw
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a class="viewBtn dropdown-item-checked" id="@Off" accesskey="0">Off ^0</a>
        <a class="viewBtn" id="@Red" accesskey="1">Red (edit white matter) ^1</a>
        <a class="viewBtn" id="@Blue" accesskey="2">Blue (edit T1 scan) ^2</a>
        <a class="viewBtn" id="@Erase" accesskey="4">Erase ^7</a>
        <a class="viewBtn" id="@Cluster" accesskey="5">Erase Cluster ^8</a>
        <a class="viewBtn" id="@GrowCluster">Grow Cluster</a>
        <a class="viewBtn" id="@GrowClusterDark">Grow Cluster Dark</a>
        <a class="viewBtn" id="@GrowClusterBright">Grow Cluster Bright</a>
        <a class="viewBtn divider dropdown-item-checked" id="DrawFilled" accesskey="f">Fill Outline ^F</a>
        <a class="viewBtn dropdown-item-checked" id="DrawOverwrite" accesskey="o">Pen Overwrites Existing ^O</a>
        <a class="viewBtn dropdown-item-checked" id="Translucent" accesskey="t">Translucent ^T</a>
        <a class="viewBtn" id="Growcut">Grow Cut</a>
        <a class="viewBtn" id="DrawOtsu">Otsu</a>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">
        Drag
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a class="viewBtn" id="^contrast">Contrast</a>
        <a class="viewBtn" id="^measurement">Measurement</a>
        <a class="viewBtn" id="^pan">Pan/Zoom</a>
        <a class="viewBtn dropdown-item-checked" id="^slicer3D">Slicer3D</a>
        <a class="viewBtn" id="^none">None</a>
      </div>
    </div>
  </div>
  </header>
  <main id="container">
    <canvas id="gl1"></canvas>
  </main>
  <footer id="intensity">&nbsp;</footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as niivue from "@niivue/niivue";
import useImageStore from '@/stores/images.js'; 

const imageStore = useImageStore();

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

let isFilled = true;
let nv1;

function handleIntensityChange(data) {
  document.getElementById("intensity").innerHTML =
    "&nbsp;&nbsp;" + data.string;
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
  const volumeList1 = [
    { url: imageStore.niiImgUrl }
  ];
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
  const buttons = document.getElementsByClassName("viewBtn");
  const char0 = id.charAt(0);
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].id.charAt(0) !== char0) continue;
    buttons[i].classList.remove("dropdown-item-checked");
    if (buttons[i].id === id)
      buttons[i].classList.add("dropdown-item-checked");
  }
}

async function onButtonClick(event) {
  const { id } = event.target;
  if (id === "SaveDraw") {
    nv1.saveImage({ filename: "draw.nii", isSaveDrawing: true });
    return;
  }
  if (id === "SaveBitmap") {
    nv1.saveScene("ScreenShot.png");
    return;
  }
  if (id === "ShowHeader") {
    alert(nv1.volumes[0].hdr.toFormattedString());
    return;
  }
  if (id === "Colorbar") {
    nv1.opts.isColorbar = !nv1.opts.isColorbar;
    event.srcElement.classList.toggle("dropdown-item-checked");
    nv1.drawScene();
    return;
  }
  if (id === "Radiological") {
    nv1.opts.isRadiologicalConvention = !nv1.opts.isRadiologicalConvention;
    event.srcElement.classList.toggle("dropdown-item-checked");
    nv1.drawScene();
    return;
  }
  if (id === "Crosshair") {
    nv1.opts.show3Dcrosshair = !nv1.opts.show3Dcrosshair;
    event.srcElement.classList.toggle("dropdown-item-checked");
    nv1.drawScene();
    return;
  }
  if (id === "RemoveHaze") {
    const cm = nv1.opts.clipPlaneColor;
    if (isFilled) nv1.setClipPlane([0.3, 270, 0]);
    else nv1.setClipPlaneFill([0.3, 270, 0], cm);
    isFilled = !isFilled;
    nv1.drawScene();
    return;
  }
  if (id === "ClipPlane") {
    nv1.opts.isPlaneClip = !nv1.opts.isPlaneClip;
    nv1.drawScene();
    return;
  }
  if (id === "WorldSpace") {
    nv1.opts.isSliceMM = !nv1.opts.isSliceMM;
    event.srcElement.classList.toggle("dropdown-item-checked");
    nv1.drawScene();
    return;
  }
  if (id === "Interpolate") {
    nv1.setInterpolation(!nv1.opts.isNearestInterpolation);
    event.srcElement.classList.toggle("dropdown-item-checked");
    nv1.drawScene();
    return;
  }
  if (id === "Left") {
    nv1.setRenderAzimuthElevation(90, 0);
    return;
  }
  if (id === "Right") {
    nv1.setRenderAzimuthElevation(270, 0);
    return;
  }
  if (id === "Anterior") {
    nv1.setRenderAzimuthElevation(180, 0);
    return;
  }
  if (id === "Posterior") {
    nv1.setRenderAzimuthElevation(0, 0);
    return;
  }
  if (id === "Inferior") {
    nv1.setRenderAzimuthElevation(0, 90);
    return;
  }
  if (id === "Superior") {
    nv1.setRenderAzimuthElevation(0, -90);
    return;
  }
  if (id.charAt(0) === "|") {
    nv1.setSliceType(parseInt(id.slice(1)));
    toggleGroup(id);
  }
  if (id.charAt(0) === "@") {
    nv1.drawPenValue = parseInt(id.charAt(1));
    toggleGroup(id);
  }
  if (id.charAt(0) === "^") {
    nv1.opts.dragMode = nv1.dragModes[id.slice(1)];
    toggleGroup(id);
  }
}

document.querySelectorAll(".viewBtn").forEach((btn) =>
  btn.addEventListener("click", onButtonClick)
);
</script>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1c1c1c;
}

header {
  margin-top: 20px; 
  display: flex;
  justify-content: flex-start; /* 将按钮容器贴左 */
  padding: 10px;
  background-color: #333;
}

.drop-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 将按钮紧贴左边 */
  padding: 0;
  margin: 0;
}

.dropdown {
  margin: 0; /* 移除外边距 */
  padding: 0; /* 移除内边距 */
}

.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 12px 12px;
  background-color: #404040;
  font-family: inherit;
  margin: 0; /* 确保按钮没有外边距 */
}

.dropdown:hover .dropbtn {
  background-color: #9a9;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #303030;
  min-width: 160px;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  line-height: 6px;
}

.dropdown-content a:hover {
  background-color: #aba;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item-checked::before {
  position: absolute;
  left: 0.2rem;
  content: "\2022"; /* or '✓' */
  font-weight: 600;
}

#container {
  width: 100%;
  height: calc(100vh - 100px);
  background-color: #000;
}

canvas {
  /*position: absolute;*/
  width: 60%;
  height: 60%;
}


footer {
  padding: 10px;
  background-color: #333;
  color: #fff;
  text-align: center;
}

</style>
