import ActionType from '../constants/ActionType';
import { Action, GameState, SavedState } from '../Types';

let savedState: SavedState = {
  highScore: 0,
  money: 0,
};

const savedStateSerialized = localStorage.getItem('savedState');
if (savedStateSerialized) {
  try {
    savedState = JSON.parse(savedStateSerialized) as SavedState;
  } catch {}
}

const initialState: GameState = {
  score: 0,
  highScore: savedState.highScore,
  defeat: false,
  lane: 0,
  money: savedState.money,
};

export default function gameState(state = initialState, action: Action) {
  const newState = { ...state };
  switch (action.type) {
    case ActionType.SET_DEFEAT:
      newState.defeat = action.value as boolean;

      savedState.highScore = newState.highScore;
      savedState.money = newState.money;

      localStorage.setItem('savedState', JSON.stringify(savedState));
      break;
    case ActionType.SET_SCORE:
      newState.score = action.value as number;
      break;
    case ActionType.SET_LANE:
      newState.lane = action.value as number;
      break;
    case ActionType.SET_MONEY:
      newState.money = action.value as number;
      break;
    case ActionType.ADD_SCORE:
      newState.score += action.value as number;
      break;
    case ActionType.ADD_MONEY:
      newState.money += action.value as number;
      break;
    default:
      return state;
  }

  if (newState.score > newState.highScore) {
    newState.highScore = newState.score;
  }

  return newState;
}
