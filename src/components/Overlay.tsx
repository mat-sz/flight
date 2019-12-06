import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import moneyImage from '../img/money.png';

import { GameState } from '../Types';

const mapStateToProps = (state: GameState) => state;

const Overlay = connect(
    mapStateToProps
)(({ score, money, defeat }: GameState) => {
    return (
        <div className="overlay">
            <div className={classNames('defeat', {
                'hidden': !defeat,
            })}>
                <div className="text">
                    Defeat
                </div>
            </div>
            <div className="score">
                Score: {Math.round(score * 100)}
            </div>
            <div className="money">
                {Math.round(money)} <img src={moneyImage} alt="Money" />
            </div>
        </div>
    )
});

export default Overlay;