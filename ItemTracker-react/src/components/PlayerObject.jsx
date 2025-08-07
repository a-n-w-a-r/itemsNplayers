import React from 'react';
import './PlayerObject.css'

function PlayerObject({ player, onDelete }) {
    return (
        <>
            <div className='player-object'>
                <h3>{player.player_tag}</h3>
                <div>
                    <button onClick={() => onDelete(player.player_id)}>Delete Player</button>
                    <button>Edit Player</button>
                </div>
            </div>
        </>
    )
}

export default PlayerObject