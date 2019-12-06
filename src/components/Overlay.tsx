import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { GameState } from '../Types';

const mapStateToProps = (state: GameState) => state;

const Overlay = connect(
    mapStateToProps
)(({ score, money, defeat }: GameState) => {
    return (
        <div className="overlay">
            <div className="score">
                <div>Score: {Math.round(score * 100)}</div>
                <div>Money: {Math.round(money)}</div>
            </div>
            <div className={classNames('defeat', {
                'hidden': !defeat,
            })}>You've lost.</div>
        </div>
    )
});

export default Overlay;