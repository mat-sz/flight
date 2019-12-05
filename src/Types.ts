import ActionType from './constants/ActionType';

export interface Action {
    type: ActionType,
    value?: number | boolean,
};

export interface GameState {
    score: number,
    lane: number,
    defeat: boolean,
};