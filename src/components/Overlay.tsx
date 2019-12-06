import React from 'react';
import { connect } from 'react-redux';

import moneyImage from '../img/money.png';

import { GameState } from '../Types';
import Defeat from './Defeat';
import Display from './Display';

const mapStateToProps = (state: GameState, { onReset }: { onReset: () => void }) => {
    return { state, onReset };
};

const Overlay = connect(
    mapStateToProps
)(({ onReset, state }: { onReset: () => void, state: GameState }) => {
    return (
        <div className="overlay">
            <Defeat hidden={!state.defeat} onReset={onReset} />
            <div className="score">
                <Display
                    title="Score"
                    value={Math.round(state.score * 100)}
                />
                <Display
                    title="High score"
                    value={Math.round(state.highScore * 100)}
                />
            </div>
            <div className="money">
                <Display
                    title="Money"
                    value={(
                        <>
                        {Math.round(state.money)} <img src={moneyImage} alt="Money" />
                        </>
                    )}
                />
            </div>
        </div>
    )
});

export default Overlay;