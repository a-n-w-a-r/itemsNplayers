import { useState } from 'react'
import { DataObject, ItemForm } from '../components'
import './ItemPage.css'
import './TileList.css'
function ItemPage({ handleFormSubmit, 
    handleEditClick, 
    items, 
    setter, 
    deletePlayer, 
    editData, 
    error, 
    isLoading }) {
    const [dataToEdit, setDataToEdit] = useState(null)

    return (
        <div className='item-page'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ItemForm 
            onSubmit={(name, qty) => {
                if (dataToEdit) {
                editData({
                    objData: { item_name: name },
                    objExtras: { item_qty: qty },
                    objType: 'item',
                    objKey: 'item_id',
                    objId: dataToEdit.item_id,
                    objSetter: setter
            })
            setDataToEdit(null)
            } else {
                handleFormSubmit({
                objType: 'item',
                objData: { item_name: name },
                objExtras: { item_qty: qty },
                objSetter: setter
                })
            }}
            }
            initialData={dataToEdit}
            />
            <h2>All Items</h2>

            {!isLoading && items.length === 0 && <p>No items found.</p>}
            {isLoading && <p>Loading Items...</p>}
            <ul className='tile-list'>
                {items.map(item => (
                    <DataObject
                    key={item.item_id}
                    data={item}
                    label="item_name"
                    id="item_id"
                    extraFields={[["item_qty", "Item Quantity"]]}
                    onDelete={ (id) => deletePlayer({
                        objType: 'item',
                        objId: id,
                        objKey: 'item_id',
                        objSetter: setter
                    })}
                    onEdit={ (item) => setDataToEdit(item) }
                    />))}
            </ul>
        </div>
    )
}

export default ItemPage