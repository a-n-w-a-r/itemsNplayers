import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './PlayerInfo.css'

function PlayerInfo({ deleteLink }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { tag } = useParams()
    const [playerData, setPlayerData] = useState([])

    // const data = location.state?.data

    // if (!data) {
    //     return <p>No data provided. Please go back and search again.</p>;
    // }

    useEffect( () => {
        if (location.state?.data) {
            setPlayerData(location.state.data)
        }

        const fetchPlayerData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/link/${ tag }`);
            if (!response.ok) {
                throw new Error(`Error status: ${response.status}`);
            }
            const data = await response.json();
            setPlayerData(data);
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }
    fetchPlayerData()
    }, [tag, location.state])

    const handleDelete = async (player_id, item_id) => {
        const success = await deleteLink(player_id, item_id)
        if (success) {
            setPlayerData(prev => prev.filter(item => item.item_id !== item_id))
        }
    }
    
    return (
        <div className="player-info">
            <h2>Player Items: {tag}</h2>
            {playerData.length === 0 && <p className="no-data">No data provided. Please go back and search again.</p>}
            <ul>
                {playerData.map( (item, index) => (
                    <li key={index}>
                        {item.item_name} - Quantity: {item.item_qty}
                        <button onClick={ () => handleDelete(item.player_id, item.item_id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* <button onClick={() => navigate('/player')}>Back to Players</button> */}
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    )
}

export default PlayerInfo