import { useEffect, useState } from "react"
import './PlayerForm.css'

function CreatePlayerForm({ onSubmit, initialData }) {
    const [player_tag, set_player_tag] = useState(initialData?.player_tag || '')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const trimmedTag = player_tag.trim();

        if (trimmedTag.length < 3 || trimmedTag.length > 30) {
            setError('Error: Player tag too short.');
            return
        }   
        onSubmit(player_tag)
        set_player_tag('')
    }

    useEffect(() => {
        if (initialData) {
            set_player_tag(initialData.player_tag)
        }
    }, [initialData])

    return (
        <>
            <form  className="player-form" onSubmit={handleSubmit}>
                <h3>Add new Player</h3>
                <input 
                type="text"
                id="player_tag"
                placeholder="Enter your player name"
                value={player_tag}
                onChange={(event) => set_player_tag(event.target.value)}
                minLength={3}
                maxLength={30}
                required
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default CreatePlayerForm