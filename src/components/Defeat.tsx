import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { GameState } from '../Types';

const Defeat = ({ onReset }: { onReset: () => void }) => {
    const defeat = useSelector((state: GameState) => state.defeat);

    return (
        <div className={classNames('defeat', {
            'hidden': !defeat,
        })}>
            <div className="text">
                Defeat
            </div>
            <div className="actions">
                <button onClick={() => onReset()}>New Game</button>
            </div>
        </div>
    )
};

export default Defeat;