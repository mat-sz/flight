import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { GameState } from '../Types';

const mapStateToProps = (state: GameState) => state;

const Overlay = connect(
    mapStateToProps
)(({ score, defeat }: { score: number, defeat: boolean }) => {
    return (
        <div className="overlay">
            <div className="score">Score: {score}</div>
            <div className={classNames('defeat', {
                'hidden': !defeat,
            })}>You've lost.</div>
        </div>
    )
});

export default Overlay;