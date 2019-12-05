import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, ConeGeometry, MeshNormalMaterial, Vector3, ShaderMaterial, PlaneGeometry } from 'three';
import { createStore } from 'redux';

import './App.scss';
import scanlines from './shaders/scanlines.frag';
import gameState from './reducers/gameState';

import addOverlay from './functions/addOverlay';
import addWindowEvents from './functions/addWindowEvents';
import tick from './functions/tick';

const gameStateStore = createStore(gameState);

const camera: PerspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.x = 0;
camera.position.z = 1;
camera.position.y = 2;

const scene: Scene = new Scene();
const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });

// The cone.
const material = new MeshNormalMaterial();
const geometry = new ConeGeometry(0.15, 0.3, 8);
const planeMesh = new Mesh(geometry, material);
planeMesh.rotateX(Math.PI/2);
scene.add(planeMesh);

// Scanlines shader.
let uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new Vector3() },
};

const shaderMaterial: ShaderMaterial = new ShaderMaterial({
    uniforms,
    fragmentShader: scanlines,
    transparent: true,
});
const shaderMesh = new Mesh(new PlaneGeometry(20, 20), shaderMaterial);
scene.add(shaderMesh);
shaderMesh.rotateX(180);

// ...and here we start rendering things.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

render(0);
 
function render(time: number) {
    uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    uniforms.iTime.value = time * 0.001;

    requestAnimationFrame(render);
 
    renderer.render(scene, camera);
}

setInterval(() => tick(camera, scene, planeMesh, shaderMesh, gameStateStore), 16.667);

addWindowEvents(camera, renderer, gameStateStore);
addOverlay(gameStateStore);