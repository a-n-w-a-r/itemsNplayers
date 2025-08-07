import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import './App.css'
import { PlayerForm, PlayerObject } from './components'
import { HomePage, PlayerPage, Layout, LinkPage, PlayerInfo } from './pages'
import ItemPage from './pages/ItemPage'

const API_BASE_URL = 'http://127.0.0.1:5000/'

function App() {
  const [players, setPlayers] = useState([])
  const [items, setItems] = useState([])
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLink] = useState({})
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [dataToEdit, setDataToEdit] = useState(null)
  const navigate = useNavigate();

  
    const fetchPlayers = async () => {
      setIsLoading(true)
      try {
        const responsePlayers = await fetch(API_BASE_URL + 'player')

        const responseItems = await fetch(API_BASE_URL + 'item')
        
        if(!responsePlayers.ok) {
          throw new Error(`Error status: ${responsePlayers.status}`)
        }
        if(!responseItems.ok) {
          throw new Error(`Error status: ${responseItems.status}`)
        }
        const playerData = await responsePlayers.json()
        setPlayers(playerData)
        
        const itemData = await responseItems.json()
        setItems(itemData)

      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setIsLoading(false)
      }
    }

  useEffect( () => {
    const fetch = async () => {
      setIsLoading(true)
      await fetchPlayers()
      setIsLoading(false)
    }

    fetch()
  }, [])

  const newPlayer = async ({ objData, objType, objExtras, objSetter }) => {
    setError(null);
    setIsLoading(true)
    try {
      console.log(JSON.stringify({...objData, ...objExtras}))
      const response = await fetch(`${API_BASE_URL}${objType}`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({...objData, ...objExtras})
      })
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error)
        // if (response.status === 409) {
        //   setError(errorData.error)
        // } else {
        //   setError(`POST error: ${response.status}`);
        // }
        return
      }

      const result = await response.json();
      console.log('POST successful:', result);
      objSetter(prev => {
        const exists = prev.find(item => item.item_id === result.item_id)
        if (exists) {
          return prev.map(item =>
          item.item_id === result.item_id ? result : item
        )
      } else {
        return [...prev, result]
      }
      });
      await fetchPlayers();

    } catch (error) {
      console.error('Error posting data:', error);
      return
    } finally {
      setIsLoading(false)
    }
  }

  // objType e.g, Player, objId e.g, 1, objKey e.g, 'player_id', objSetter e.g, setPlayers
  const deletePlayer = async ({ objType, objId, objKey, objSetter }) => {
    setIsLoading(true)
    setError(null)
    try {
      // Build HTTP Delete url
      const response = await fetch(`${API_BASE_URL}${objType}/${objId}`, {method: 'DELETE'})
      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 500) {
          setError(errorData.error)
        } else {
          setError(`DELETE error: ${response.status}`);
        }
        return
      }
      // Using props we filter with the setter for each object not equal to the objId
      objSetter(prev => prev.filter(object => object[objKey] !== objId))

    } catch (error) {
      console.error('Error deleting data:', error)
      return
    } finally {
      setIsLoading(false)
    }
  }

  const editData = async ({ objData, objType, objId, objKey, objExtras, objSetter }) => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await fetch(`${API_BASE_URL}${objType}/${objId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({...objData, ...objExtras})
      })
      console.log("PATCH raw response:", response);
      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 409) {
          setError(errorData.error)
        } else {
          setError(`PATCH error: ${response.status}`);
        }
        return
      }

      const result = await response.json();
      console.log('PATCH successful:', result);
      objSetter(prev => prev.map(obj => obj[objKey] === objId ? result : obj));

    } catch (error) {
      console.error('Error patching data:', error);
      return
    } finally {
      setIsLoading(false)
    }
  }

  const viewFullData = async (player_tag) => {
    try {
      const response = await fetch(`${API_BASE_URL}link/${player_tag}`)

      if (!response.ok) {
        throw new Error(`Error status: ${responsePlayers.status}`)
      }

      const data = await response.json()

      navigate(`/link/${player_tag}`, { state: {data} })

      // setCurrentLink(data)
    } catch (error) {
        console.error('Error fetching data: ', error)
      } 
  }

  const deleteLink = async (player_id, item_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}link/${player_id}/${item_id}`, {method: 'DELETE'})

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 500) {
          setError(errorData.error)
        } else {
          setError(`DELETE error: ${response.status}`);
        }
        return
      }
      
      console.log("Successful", response)
      return true

    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const handleFormSubmit = ({objData, objType, objExtras, objSetter }) => {
    return newPlayer({objData, objType, objExtras, objSetter })
  }

  const handleEditClick = (objData) => {
    setDataToEdit(objData)
  }

  // console.log(players, items)
  
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path = '/' element={<Layout/>}>
            <Route index element = {<HomePage/>} />
            
            <Route path='player' element = {<PlayerPage
              handleFormSubmit={handleFormSubmit}
              players={players}
              setter={setPlayers}
              deletePlayer={deletePlayer}
              editData={editData}
              viewFullData={viewFullData}
              error={error}
              isLoading={isLoading}/>} 
            />

            <Route path='item' element = {<ItemPage 
            handleFormSubmit={handleFormSubmit}
            handleEditClick={handleEditClick}
            items={items}
            setter={setItems}
            deletePlayer={deletePlayer}
            editData={editData}
            error={error}
            isLoading={isLoading}
            />}/>

            <Route path='link' element= {<LinkPage
            handleFormSubmit={handleFormSubmit}
            setter={setLinks}
            error={error}
            isLoading={isLoading}
            />}/>

            <Route path="link/:tag" element={<PlayerInfo 
            deleteLink={deleteLink}/>} />

          </Route>
        </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default App
