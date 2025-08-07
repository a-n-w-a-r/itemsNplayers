import { useState, useEffect } from "react"
import './PlayerForm.css'

function CreateItemForm({ onSubmit, initialData }) {
    const [item_name, set_item_name] = useState(initialData?.item_name || '')
    const [item_qty, set_item_qty] = useState(initialData?.item_qty || '')
    const [error, setError] = useState('')
    

    const handleSubmit = async (event) => {
        event.preventDefault()

        const trimmedName = item_name.trim();

        if (trimmedName.length < 3 || trimmedName.length > 30) {
            setError('Error: Player tag too short.');
            return error
        }   
        onSubmit(item_name, item_qty)
        set_item_name('')
        set_item_qty('')
    }
    useEffect(() => {
        if (initialData) {
            set_item_name(initialData.item_name || '')
            set_item_qty(initialData.item_qty || '')
        }
    }, [initialData])

    return (
        <>
            <form className="player-form" onSubmit={handleSubmit}>
                <h3>Add new Item</h3>
                <input 
                type="text"
                placeholder="Enter your item name"
                value={item_name}
                onChange={(event) => set_item_name(event.target.value)}
                minLength={3}
                maxLength={30}
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

export default CreateItemForm