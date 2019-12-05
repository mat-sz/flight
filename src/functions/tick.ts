import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, ConeGeometry, IcosahedronGeometry, BoxGeometry, MeshNormalMaterial, Vector3, ShaderMaterial, PlaneGeometry } from 'three';
import { Store, Action } from 'redux';

import { laneWidth } from '../constants';
import ActionType from '../constants/ActionType';
import { GameState } from '../Types';

let boxMeshes: Mesh[] = [];
let pickupMeshes: Mesh[] = [];

let counter = 0;
let speed = 0.02;

let spawnCycle = 0;
let spawnMode = 0;

function spawnPickup(camera: PerspectiveCamera, scene: Scene, lane: number) {
    const geometry = new IcosahedronGeometry(0.1, 0);
    const material = new MeshNormalMaterial();
    let pickupMesh = new Mesh(geometry, material);
    pickupMesh.position.x = lane * laneWidth;
    pickupMesh.position.y = 0;
    pickupMesh.position.z = camera.position.z + 4;

    pickupMeshes.push(pickupMesh);
    
    scene.add(pickupMesh);
}

function spawnBox(camera: PerspectiveCamera, scene: Scene, lane: number) {
    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();
    let boxMesh = new Mesh(geometry, material);
    boxMesh.position.x = lane * laneWidth;
    boxMesh.position.y = 0;
    boxMesh.position.z = camera.position.z + 4;

    boxMeshes.push(boxMesh);
    
    scene.add(boxMesh);
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

export default function tick(camera: PerspectiveCamera, scene: Scene, planeMesh: Mesh, shaderMesh: Mesh, gameStateStore: Store<GameState, Action>) {
    if (gameStateStore.getState().defeat) return;

    camera.position.z += speed;
    camera.lookAt(new Vector3(0, 1, camera.position.z + 1));

    shaderMesh.position.x = 0;
    shaderMesh.position.y = 0;
    shaderMesh.position.z = camera.position.z;
    
    const targetX = gameStateStore.getState().lane * -(laneWidth);
    planeMesh.position.y = 0;
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

    counter++;

    if (counter > 15) {
        counter = 0;
        spawn(camera, scene);
    }

    pickupMeshes = pickupMeshes.filter((mesh) => {
        if (Math.abs(planeMesh.position.x - mesh.position.x) < 0.2
            && Math.abs(planeMesh.position.z - mesh.position.z) < 0.15) {
            // Dumb collision detection.
            gameStateStore.dispatch({ type: ActionType.INCREMENT_SCORE });
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