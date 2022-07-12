import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
} from "web-ifc";

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const aspect = size.width / size.height;
const camera = new PerspectiveCamera(75, aspect);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({
  canvas: threeCanvas,
  alpha: true,
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
const grid = new GridHelper(100, 100);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

const cubeGeometry1 = new BoxGeometry(5, 5, 5);
const cubeGeometry2 = new BoxGeometry(3, 3, 3);
const materialYellow = new MeshBasicMaterial({ color: 0xffff00 });
const materialRed = new MeshBasicMaterial({ color: 0xff4f40 });
const cube = new Mesh(cubeGeometry1, materialYellow);
const cube2 = new Mesh(cubeGeometry2, materialRed);
cube.position.x = 7;
cube2.position.x = -7;
scene.add(cube, cube2);

const transformControl = new TransformControls(camera, threeCanvas);
transformControl.attach(cube);
scene.add(transformControl);

let human;
const loaderGLTF = new GLTFLoader();
loaderGLTF.load("../public/human3.gltf", (gltf) => {
  human = gltf.scene;
  scene.add(human);
});

window.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyG":
      transformControl.setMode("translate");
      break;
    case "KeyR":
      transformControl.setMode("rotate");
      break;
    case "KeyS":
      transformControl.setMode("scale");
      break;
  }
});

transformControl.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

import { IFCLoader } from "web-ifc-three/IFCLoader";

// Sets up the IFC loading
const ifcLoader = new IFCLoader();

const input = document.getElementById("file-input");
input.addEventListener(
  "change",
  async (changed) => {
    const file = changed.target.files[0];
    var ifcURL = URL.createObjectURL(file);
    ifcLoader.load(ifcURL, (ifcModel) => scene.add(ifcModel));
  },
  false
);

const inputList = document.querySelectorAll("#position-panel > input");
let newPos = { x: 0, y: 0, z: 0 };

inputList[0].addEventListener("change", (e) => {
  newPos = { ...newPos, x: e.target.value };
});
inputList[1].addEventListener("change", (e) => {
  newPos = { ...newPos, y: e.target.value };
});

inputList[2].addEventListener("change", (e) => {
  newPos = { ...newPos, z: e.target.value };
});

const btnSubmit = document.getElementById("submit");
btnSubmit.addEventListener("click", () => {
  human.position.x = newPos.x;
  human.position.y = newPos.y;
  human.position.z = newPos.z;
});
