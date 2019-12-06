import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import moneyImage from '../img/money.png';

import { GameState } from '../Types';

const mapStateToProps = (state: GameState, { onReset }: { onReset: () => void }) => {
    return { state, onReset };
};

const Overlay = connect(
    mapStateToProps
)(({ onReset, state }: { onReset: () => void, state: GameState }) => {
    return (
        <div className="overlay">
            <div className={classNames('defeat', {
                'hidden': !state.defeat,
            })}>
                <div className="text">
                    Defeat
                </div>
                <div className="actions">
                    <button onClick={() => onReset()}>New Game</button>
                </div>
            </div>
            <div className="score">
                Score: {Math.round(state.score * 100)}
            </div>
            <div className="money">
                {Math.round(state.money)} <img src={moneyImage} alt="Money" />
            </div>
        </div>
    )
});

export default Overlay;