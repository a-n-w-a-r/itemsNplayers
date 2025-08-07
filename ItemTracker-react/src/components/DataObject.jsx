import './DataObject.css';
function DataObject({ data, label, id, extraFields = [], onDelete, onEdit, viewFull = false, onViewFull }) {

    return (
        <>
            <div className="data-object">
                <h3>{data[label]}</h3>

                {extraFields.map( ([field, displayField]) => (
                    <p key={`${data[id]}-${field}`}>
                        {displayField}: {data[field]}
                    </p>
                ))}
                <div>
                    <button className="delete-btn" onClick={() => onDelete(data[id])}>
                        Delete
                    </button>
                    <button className="edit-btn" onClick={ () => onEdit(data)}>
                        Edit
                    </button>
                    {viewFull && <button onClick={ () => onViewFull(data[label])}>View</button>}
                </div>
            
            </div>
        </>
    )
}

export default DataObject;