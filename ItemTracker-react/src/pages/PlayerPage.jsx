import { useState } from 'react'
import { PlayerForm, PlayerObject, DataObject } from '../components'
import './PlayerPage.css'

function PlayerPage({ handleFormSubmit, 
    players, 
    setter, 
    deletePlayer, 
    editData, 
    viewFullData,
    error, 
    isLoading }) {
    const [dataToEdit, setDataToEdit] = useState(null)
    return (
        <div className='player-page'>
            {/* <h2>New Player</h2> */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <PlayerForm 
            onSubmit={ (data) => {
                if (dataToEdit) {
                    editData({
                        objData: { player_tag: data },
                        objType: 'player',
                        objKey: 'player_id',
                        objId: dataToEdit.player_id,
                        objSetter: setter
                    })
                setDataToEdit(null)
                } else {
                    handleFormSubmit({
                    objType: 'player',
                    objData: {'player_tag': data},
                    objSetter: setter}
                )}
            }}
            initialData={dataToEdit}
            />

            <h2>All Players</h2>

            {!isLoading && players.length === 0 && <p>No players found.</p>}
            {isLoading && <p>Loading Players...</p>}

            <ul>
                {!isLoading && players.map(player => (
                // <PlayerObject
                // key={player.player_id}
                // player={player}
                // onDelete={deletePlayer}
                // />
                <DataObject
                    key={player.player_id}
                    data={player}
                    label="player_tag"
                    id="player_id"
                    onDelete={ (id) => deletePlayer({
                        objType: 'player',
                        objId: id,
                        objKey: 'player_id',
                        objSetter: setter
                    })}
                    onEdit={ (player) => setDataToEdit(player) }
                    onViewFull={ (player_tag) => viewFullData(player_tag)}
                    viewFull={true}
                />
                ))}
            </ul>

        </div>
    )
}

export default PlayerPage