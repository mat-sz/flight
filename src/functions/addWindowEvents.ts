import { PerspectiveCamera, WebGLRenderer } from 'three';
import { GameState } from '../Types';
import { Store, Action } from 'redux';
import ActionType from '../constants/ActionType';

export default function addWindowEvents(camera: PerspectiveCamera, renderer: WebGLRenderer, store: Store<GameState, Action>, onReset: () => void) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (event) => {
        const state = store.getState();
        switch (event.key) {
            case 'ArrowLeft':
                if (state.lane > -1) {
                    store.dispatch({ type: ActionType.SET_LANE, value: state.lane - 1 });
                }
                break;
            case 'ArrowRight':
                if (state.lane < 1) {
                    store.dispatch({ type: ActionType.SET_LANE, value: state.lane + 1 });
                }
                break;
            case ' ':
                if (state.defeat) {
                    onReset();
                }
                break;
        }
    });

    window.addEventListener('touchstart', (event) => {
        const planeLane = store.getState().lane;
        const touch = event.touches[0];

        if (touch.pageX < window.innerWidth/2) {
            if (planeLane > -1)
                store.dispatch({ type: ActionType.SET_LANE, value: planeLane - 1 });
        } else {
            if (planeLane < 1)
                store.dispatch({ type: ActionType.SET_LANE, value: planeLane + 1 });
        }
    });
}