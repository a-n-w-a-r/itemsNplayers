import { useState, useEffect } from "react";

function CreateLinkForm({ onSubmit }) {
    const [player_tag, set_player_tag] = useState('')
    const [item_name, set_item_name] = useState('')
    const [item_qty, set_item_qty] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        onSubmit(player_tag, item_name, item_qty)
        set_player_tag('')
        set_item_name('')
        set_item_qty('')
    }

    return(
        <>
            <form className="player-form" onSubmit={handleSubmit}>
                <h3>Enter player tag</h3>
                <input 
                type="text"
                placeholder="Enter Player tag"
                value={player_tag}
                onChange={(event) => set_player_tag(event.target.value)}
                minLength={3}
                maxLength={30}
                required
                />
                <h3>Enter item name</h3>
                <input
                placeholder="Enter your item name"
                value={item_name}
                type="text"
                name="item_name"
                onChange={(event) => set_item_name(event.target.value)}
                min={3}
                max={100}
                required
                />
                <input
                placeholder="Enter your item quantity"
                value={item_qty}
                type="number"
                name="quantity"
                onChange={(event) => set_item_qty(event.target.value)}
                min={0}
                max={100}
                required
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default CreateLinkForm