import ActionType from '../constants/ActionType';
import { Action, GameState } from '../Types';
  
const initialState: GameState = {
    score: 0,
    defeat: false,
    lane: 0,
    money: 0,
};
  
export default function gameState(state = initialState, action: Action) {
    const newState = {...state};
    switch (action.type) {
        case ActionType.SET_DEFEAT:
            newState.defeat = action.value as boolean;
            return newState;
        case ActionType.SET_SCORE:
            newState.score = action.value as number;
            return newState;
        case ActionType.SET_LANE:
            newState.lane = action.value as number;
            return newState;
        case ActionType.SET_MONEY:
            newState.money = action.value as number;
            return newState;
        case ActionType.ADD_SCORE:
            newState.score += action.value as number;
            return newState;
        case ActionType.ADD_MONEY:
            newState.money += action.value as number;
            return newState;
        default:
            return state;
    }
};