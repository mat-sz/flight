import { PerspectiveCamera, Scene, Mesh, IcosahedronGeometry, BoxGeometry, MeshNormalMaterial, Vector3, Geometry } from 'three';
import { Store, Action } from 'redux';

import { laneWidth } from '../constants';
import ActionType from '../constants/ActionType';
import { GameState } from '../Types';

let boxMeshes: Mesh[] = [];
let pickupMeshes: Mesh[] = [];

let lastX = 0;
let speed = 0.02;

let spawnCycle = 0;
let spawnMode = 0;

function spawnGeometry(geometry: Geometry, trackingArray: Mesh[], camera: PerspectiveCamera, scene: Scene, lane: number) {
    const material = new MeshNormalMaterial();
    let mesh = new Mesh(geometry, material);
    mesh.position.x = Math.floor(camera.position.x / 0.3) * 0.3 + 6;
    mesh.position.y = 0;
    mesh.position.z = lane * laneWidth;

    trackingArray.push(mesh);
    
    scene.add(mesh);
}

function spawnPickup(camera: PerspectiveCamera, scene: Scene, lane: number) {
    const geometry = new IcosahedronGeometry(0.1, 0);
    spawnGeometry(geometry, pickupMeshes, camera, scene, lane);
}

function spawnBox(camera: PerspectiveCamera, scene: Scene, lane: number) {
    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    spawnGeometry(geometry, boxMeshes, camera, scene, lane);
}

function spawn(camera: PerspectiveCamera, scene: Scene) {
    spawnCycle++;

    switch (spawnMode) {
        case 0:
            if (spawnCycle < 4) {
                spawnBox(camera, scene, 0);
                spawnBox(camera, scene, 1);
            }
            if (spawnCycle == 4) spawnPickup(camera, scene, 0);
            break;
        case 1:
            if (spawnCycle < 4) {
                spawnBox(camera, scene, -1);
                spawnBox(camera, scene, 1);
            }
            if (spawnCycle == 4) spawnPickup(camera, scene, 0);
            break;
        case 2:
            if (spawnCycle % 3 != 2)
                spawnBox(camera, scene, Math.round(Math.random() * 2) - 1);
            break;
        case 3:
            if (spawnCycle % 3 != 2)
                spawnBox(camera, scene, spawnCycle % 2 - 1);
            break;
    }

    // Get rid of the ones we don't see anyway.
    boxMeshes = boxMeshes.filter((mesh) => {
        if (mesh.position.x < camera.position.x) {
            scene.remove(mesh);
            return false;
        }

        return true;
    });

    pickupMeshes = pickupMeshes.filter((mesh) => {
        if (mesh.position.x < camera.position.x) {
            scene.remove(mesh);
            return false;
        }

        return true;
    });

    if (spawnCycle == 5) {
        spawnCycle = 0;
        spawnMode = Math.round(Math.random() * 3);
    }
}

export function reset(camera: PerspectiveCamera, scene: Scene, planeMesh: Mesh, gameStateStore: Store<GameState, Action>) {
    gameStateStore.dispatch({ type: ActionType.SET_SCORE, value: 0 });
    camera.position.x = 0;
    planeMesh.position.x = 1;
    camera.lookAt(new Vector3(camera.position.x + 1, 1, 0));

    lastX = 0;
    speed = 0.02;
    spawnCycle = 0;
    spawnMode = 0;
    
    boxMeshes = boxMeshes.filter((mesh) => {
        scene.remove(mesh);
        return false;
    });

    pickupMeshes = pickupMeshes.filter((mesh) => {
        scene.remove(mesh);
        return false;
    });

    gameStateStore.dispatch({ type: ActionType.SET_DEFEAT, value: false });
}

export function spawnTick(camera: PerspectiveCamera, scene: Scene) {
    const currentX = Math.floor(camera.position.x / 0.3);
    if (currentX > lastX) {
        if (lastX !== 0)
            spawn(camera, scene);

        lastX = currentX;
        speed += 0.0001;
    }
}

export default function tick(camera: PerspectiveCamera, scene: Scene, planeMesh: Mesh, gameStateStore: Store<GameState, Action>, timeDifference: number) {
    const state = gameStateStore.getState();
    if (state.defeat) return;

    // 16.667 = 60 FPS tick target
    camera.position.x += speed * (timeDifference / 16.667);
    camera.lookAt(new Vector3(camera.position.x + 1, 1, 0));
    
    const targetZ = state.lane * laneWidth;
    planeMesh.position.x = camera.position.x + 1;
    
    if (planeMesh.position.z != targetZ) {
        if (targetZ > planeMesh.position.z) {
            planeMesh.position.z += 0.04;
        } else {
            planeMesh.position.z -= 0.04;
        }

        if (Math.abs(planeMesh.position.z - targetZ) < 0.04) {
            planeMesh.position.z = targetZ;
        }
    }

    for (let pickupMesh of pickupMeshes) {
        pickupMesh.rotation.x += 0.01;
        pickupMesh.rotation.z -= 0.02;
    }

    pickupMeshes = pickupMeshes.filter((mesh) => {
        if (Math.abs(planeMesh.position.x - mesh.position.x) < 0.15
            && Math.abs(planeMesh.position.z - mesh.position.z) < 0.2) {
            // Dumb collision detection.
            gameStateStore.dispatch({ type: ActionType.ADD_MONEY, value: 1 });
            scene.remove(mesh);
            return false;
        } else {
            return true;
        }
    });

    for (let mesh of boxMeshes) {
        if (Math.abs(planeMesh.position.x - mesh.position.x) < 0.15
            && Math.abs(planeMesh.position.z - mesh.position.z) < 0.2) {
            gameStateStore.dispatch({ type: ActionType.SET_DEFEAT, value: true });
        }
    }
};