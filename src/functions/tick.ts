import { PerspectiveCamera, Scene, Mesh, IcosahedronGeometry, BoxGeometry, MeshNormalMaterial, Vector3, Geometry } from 'three';
import { Store, Action } from 'redux';

import { laneWidth } from '../constants';
import ActionType from '../constants/ActionType';
import { GameState } from '../Types';

let boxMeshes: Mesh[] = [];
let pickupMeshes: Mesh[] = [];

let lastZ = 0;
let speed = 0.02;

let spawnCycle = 0;
let spawnMode = 0;

function spawnGeometry(geometry: Geometry, trackingArray: Mesh[], camera: PerspectiveCamera, scene: Scene, lane: number) {
    const material = new MeshNormalMaterial();
    let mesh = new Mesh(geometry, material);
    mesh.position.x = lane * laneWidth;
    mesh.position.y = 0;
    mesh.position.z = camera.position.z + 6;

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
        if (mesh.position.z < camera.position.z) {
            scene.remove(mesh);
            return false;
        }

        return true;
    });

    pickupMeshes = pickupMeshes.filter((mesh) => {
        if (mesh.position.z < camera.position.z) {
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
    camera.position.z = 0;
    planeMesh.position.z = 1;
    camera.lookAt(new Vector3(0, 1, camera.position.z + 1));

    lastZ = 0;
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

export default function tick(camera: PerspectiveCamera, scene: Scene, planeMesh: Mesh, gameStateStore: Store<GameState, Action>) {
    const state = gameStateStore.getState();
    if (state.defeat) return;

    camera.position.z += speed;
    camera.lookAt(new Vector3(0, 1, camera.position.z + 1));
    
    const targetX = state.lane * -(laneWidth);
    planeMesh.position.z = camera.position.z + 1;
    
    if (planeMesh.position.x != targetX) {
        if (targetX > planeMesh.position.x) {
            planeMesh.position.x += 0.04;
        } else {
            planeMesh.position.x -= 0.04;
        }

        if (Math.abs(planeMesh.position.x - targetX) < 0.04) {
            planeMesh.position.x = targetX;
        }
    }

    for (let pickupMesh of pickupMeshes) {
        pickupMesh.rotation.x += 0.01;
        pickupMesh.rotation.z -= 0.02;
    }

    const currentZ = Math.floor(camera.position.z / 0.3);
    if (currentZ > lastZ) {
        if (lastZ !== 0)
            spawn(camera, scene);

        lastZ = currentZ;
        speed += 0.0001;
    }

    pickupMeshes = pickupMeshes.filter((mesh) => {
        if (Math.abs(planeMesh.position.x - mesh.position.x) < 0.2
            && Math.abs(planeMesh.position.z - mesh.position.z) < 0.15) {
            // Dumb collision detection.
            gameStateStore.dispatch({ type: ActionType.ADD_MONEY, value: 1 });
            scene.remove(mesh);
            return false;
        } else {
            return true;
        }
    });

    for (let mesh of boxMeshes) {
        if (Math.abs(planeMesh.position.x - mesh.position.x) < 0.2
            && Math.abs(planeMesh.position.z - mesh.position.z) < 0.15) {
            gameStateStore.dispatch({ type: ActionType.SET_DEFEAT, value: true });
        }
    }
};