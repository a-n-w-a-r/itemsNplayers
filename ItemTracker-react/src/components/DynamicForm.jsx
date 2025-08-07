import { useState } from "react";

function DynamicForm({ fields, onSubmit }) {

    const [ formData, setFormData ] = useState({})

    const handleChange = ( inputName, inputValue ) => {
        setFormData( prev => ({
            ...prev, [inputName]:inputValue
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit(formData)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                {fields.map( (field) => (
                    <div key={field.name}>
                        <label>
                            {field.name} {field.required && '*'}
                        </label>

                        {(field.type === 'text' || field.type === 'number') && (
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                onChange={ (event) => handleChange(field.name, event.target.value)}
                            />
                        )}
                    </div>
                ))}
            </form>
        </>
    )
}

export default DynamicForm