import React from 'react';
import { useSelector } from 'react-redux';
import { MobileView, BrowserView } from 'react-device-detect';

import moneyImage from '../img/money.png';

import { GameState } from '../Types';
import Defeat from './Defeat';
import Display from './Display';

const Overlay = ({ onReset }: { onReset: () => void }) => {
    const score = useSelector((state: GameState) => state.score);
    const highScore = useSelector((state: GameState) => state.highScore);
    const money = useSelector((state: GameState) => state.money);

    return (
        <div className="overlay">
            <Defeat onReset={onReset} />
            <div className="score">
                <Display
                    title="Score"
                    value={Math.round(score * 100)}
                />
                <Display
                    title="High score"
                    value={Math.round(highScore * 100)}
                />
            </div>
            <div className="money">
                <Display
                    title="Money"
                    value={(
                        <>
                        {Math.round(money)} <img src={moneyImage} alt="Money" />
                        </>
                    )}
                />
            </div>
            <div className="help">
                <MobileView>
                    Tap on left and right sides of the screen to move.
                </MobileView>
                <BrowserView>
                    Use left and right arrow keys to move.
                </BrowserView>
            </div>
        </div>
    )
};

export default Overlay;