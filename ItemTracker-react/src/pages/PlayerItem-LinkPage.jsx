import { useState } from "react"
import { LinkForm } from "../components"
import './LinkPage.css'

function LinkPage({ handleFormSubmit, 
    links, 
    setter,
    error,
    isLoading,
    }) {

    return (
        <div className="link-page">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <LinkForm
                onSubmit={(player, item, qty) => {
                handleFormSubmit({
                    objType: 'link',
                    objData: { player_tag: player, item_name: item, item_qty: qty},
                    objSetter: setter
                })
            }}
            />
        </div>
    )
}
export default LinkPage