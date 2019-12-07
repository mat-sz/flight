import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, ConeGeometry, MeshNormalMaterial, Vector2, WebGLRenderTarget } from 'three';
import { createStore } from 'redux';

import './App.scss';

import gameState from './reducers/gameState';
import addOverlay from './functions/addOverlay';
import addWindowEvents from './functions/addWindowEvents';
import tick, { reset, spawnTick } from './functions/tick';
import createShaders from './shaders';
import ActionType from './constants/ActionType';

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

const shaders = createShaders(renderer);

// ...and here we start rendering things.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const outputBuffer: WebGLRenderTarget = new WebGLRenderTarget(1, 1);
outputBuffer.texture.generateMipmaps = false;
render(0);
 
function render(time: number) {
    tick(camera, scene, planeMesh, gameStateStore);

    const size = renderer.getDrawingBufferSize(new Vector2());
    outputBuffer.setSize(size.width, size.height);
    
    renderer.setRenderTarget(outputBuffer);
    renderer.render(scene, camera);

    shaders.reduce((buffer, current, i) => current(buffer, time, i === shaders.length - 1), outputBuffer);

    requestAnimationFrame(render);
}

setInterval(() => {
    gameStateStore.dispatch({ type: ActionType.SET_SCORE, value: camera.position.z });
}, 75);

setInterval(() => {
    spawnTick(camera, scene);
}, 100);

addWindowEvents(camera, renderer, gameStateStore);
addOverlay(gameStateStore, () => {
    reset(camera, scene, planeMesh, gameStateStore);
});