import React from 'react';
import classNames from 'classnames';

const Defeat = ({ hidden, onReset }: { hidden: boolean, onReset: () => void }) => {
    return (
        <div className={classNames('defeat', {
            'hidden': hidden,
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