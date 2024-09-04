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
import { useTokenStore } from '@/stores/token.js';
import useDocStore from '@/stores/document.js';

const docStore = useDocStore();
const tokenStore = useTokenStore();
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

  // 组件加载后，初始化按钮状态
  document.querySelectorAll(".viewBtn").forEach((btn) =>
  btn.addEventListener("click", onButtonClick)

);
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
    if (event.target.id === "SaveDraw") {
      nv1.saveImage({ filename: 'draw.nii', isSaveDrawing: true })
      return;
    }
    if (event.target.id === "SaveBitmap") {
      nv1.saveScene("ScreenShot.png");
      uploadCanvasImage();
      return;
    }
    if (event.target.id === "ShowHeader") {
      alert(nv1.volumes[0].hdr.toFormattedString());
      return;
    }
    if (event.target.id === "Colorbar") {
      nv1.opts.isColorbar = !nv1.opts.isColorbar;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
      return;
    }
    if (event.target.id === "Radiological") {
      nv1.opts.isRadiologicalConvention = !nv1.opts.isRadiologicalConvention;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
      return;
    }
    if (event.target.id === "Crosshair") {
      nv1.opts.show3Dcrosshair = !nv1.opts.show3Dcrosshair;
      event.srcElement.classList.toggle("dropdown-item-checked");
      nv1.drawScene();
    }
    if (event.target.id === "ClipPlane") {
      if (nv1.scene.clipPlaneDepthAziElev[0] > 1)
        nv1.setClipPlane([0.3, 270, 0]);
      else nv1.setClipPlane([2, 270, 0]);
      nv1.drawScene();
      return;
    }
    if (event.target.id === "Undo") {
      nv1.drawUndo();
    }
    if (event.target.id.charAt(0) === "@") {
      //sliceType
      if (event.target.id === "@Off") nv1.setDrawingEnabled(false);
      else nv1.setDrawingEnabled(true);
      if (event.target.id === "@Erase") nv1.setPenValue(0, isFilled);
      if (event.target.id === "@Red") nv1.setPenValue(1, isFilled);
      if (event.target.id === "@Blue") nv1.setPenValue(2, isFilled);
      if (event.target.id === "@Cluster") nv1.setPenValue(-0, isFilled);
      if (event.target.id === "@GrowCluster") nv1.setPenValue(NaN, isFilled);
      if (event.target.id === "@GrowClusterBright")
        nv1.setPenValue(Number.POSITIVE_INFINITY, isFilled);
      if (event.target.id === "@GrowClusterDark")
        nv1.setPenValue(Number.NEGATIVE_INFINITY, isFilled);
      toggleGroup(event.target.id);
    } //Draw Color
    if (event.target.id === "Growcut") nv1.drawGrowCut();
    if (event.target.id === "Translucent") {
      if (nv1.drawOpacity > 0.75) nv1.drawOpacity = 0.5;
      else nv1.drawOpacity = 1.0;
      nv1.drawScene();
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id === "DrawOtsu") {
      let levels = parseInt(prompt("Segmentation classes (2..4)", "3"));
      nv1.drawOtsu(levels);
    }
    if (event.target.id === "RemoveHaze") {
      let level = parseInt(prompt("Remove Haze (1..5)", "5"));
      nv1.removeHaze(level);
    }
    if (event.target.id === "DrawFilled") {
      isFilled = !isFilled;
      nv1.setPenValue(nv1.opts.penValue, isFilled);
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id === "DrawOverwrite") {
      nv1.drawFillOverwrites = !nv1.drawFillOverwrites;
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id.charAt(0) === "|") {
      //sliceType
      if (event.target.id === "|Axial") nv1.setSliceType(nv1.sliceTypeAxial);
      if (event.target.id === "|Coronal")
        nv1.setSliceType(nv1.sliceTypeCoronal);
      if (event.target.id === "|Sagittal")
        nv1.setSliceType(nv1.sliceTypeSagittal);
      if (event.target.id === "|Render") nv1.setSliceType(nv1.sliceTypeRender);
      if (event.target.id === "|MultiPlanar") {
        nv1.opts.multiplanarShowRender = niivue.SHOW_RENDER.AUTO;
        nv1.setSliceType(nv1.sliceTypeMultiplanar);
      }
      if (event.target.id === "|MultiPlanarRender") {
        nv1.opts.multiplanarShowRender = niivue.SHOW_RENDER.ALWAYS;
        nv1.setSliceType(nv1.sliceTypeMultiplanar);
      }
      toggleGroup(event.target.id);
    } //sliceType
    if (event.target.id === "WorldSpace") {
      nv1.setSliceMM(!nv1.opts.isSliceMM);
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id === "Interpolate") {
      nv1.setInterpolation(!nv1.opts.isNearestInterpolation);
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id === "Left") nv1.moveCrosshairInVox(-1, 0, 0);
    if (event.target.id === "Right") nv1.moveCrosshairInVox(1, 0, 0);
    if (event.target.id === "Posterior") nv1.moveCrosshairInVox(0, -1, 0);
    if (event.target.id === "Anterior") nv1.moveCrosshairInVox(0, 1, 0);
    if (event.target.id === "Inferior") nv1.moveCrosshairInVox(0, 0, -1);
    if (event.target.id === "Superior") nv1.moveCrosshairInVox(0, 0, 1);
    if (event.target.id === "BackColor") {
      if (nv1.opts.backColor[0] < 0.5) nv1.opts.backColor = [1, 1, 1, 1];
      else nv1.opts.backColor = [0, 0, 0, 1];
      nv1.drawScene();
      event.srcElement.classList.toggle("dropdown-item-checked");
      return;
    }
    if (event.target.id.charAt(0) === "^") {
      //drag mode
      let s = event.target.id.substr(1);
      switch (s) {
        case "none":
          nv1.opts.dragMode = nv1.dragModes.none;
          break;
        case "contrast":
          nv1.opts.dragMode = nv1.dragModes.contrast;
          break;
        case "measurement":
          nv1.opts.dragMode = nv1.dragModes.measurement;
          break;
        case "pan":
          nv1.opts.dragMode = nv1.dragModes.pan;
          break;
        case "slicer3D":
          nv1.opts.dragMode = nv1.dragModes.slicer3D;
          break;
      }
      toggleGroup(event.target.id);
    } //drag mode
  } // onButtonClick()

const uploadCanvasImage = async () => {  
  try {  
    const canvas = document.getElementById('gl1');  
    if (!canvas) {  
      throw new Error('Canvas not found');  
    }  

    nv1.drawScene();
    canvas.toBlob(async (blob) => {  
      if (!blob) {  
        throw new Error('Failed to create blob from canvas image');  
      }  

      const file = new File([blob], 'canvas-image.png', { type: 'image/png' });  
      const formData = new FormData();  
      formData.append('file', file);  

      try {  
        const response = await fetch('/api/niiupload', {  
          method: 'POST',  
          headers: {  
            'Authorization': tokenStore.token,  
          },  
          body: formData,  
        });  

        if (!response.ok) {  
          throw new Error('Upload failed');  
        }  

        const jsonResponse = await response.json(); // 修改变量名以避免冲突  
        docStore.addImage(jsonResponse.data); // 确保使用正确的响应数据  
        console.log("docStore images : ", docStore.images);  
        console.log('上传成功:', jsonResponse.data); // 调试输出  
      } catch (err) {  
        console.log('上传失败:', err.message); // 使用 err.message 而不是 response.message  
      }  
    }, 'image/png');  
  } catch (error) {  
    console.error('Error in uploadCanvasImage:', error.message); // 捕获并输出外层 try-catch 的错误  
  }  
};


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
