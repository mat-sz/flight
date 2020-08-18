import ActionType from './constants/ActionType';

export interface Action {
  type: ActionType;
  value?: number | boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  lane: number;
  money: number;
  defeat: boolean;
}

export interface SavedState {
  highScore: number;
  money: number;
}
