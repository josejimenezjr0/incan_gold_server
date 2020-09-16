import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import io from '../Socket'
import db from '../db'

const Lobby = () => {
  const location = useLocation()
  const locationGame = location.state && location.state.game
  const locationUuid = location.state && location.state.uuid
  const [lobby, setLobby] = useState({ room: '', players: [], size: 3 })
  const [uuid, setUuid] = useState(null)

  const updateGame = async game => {
    try {
      const gameUpdate = await db.game.put(game)
      setLobby(game)
    } catch (error) {
    }  
  }

  const saveUuid = async uuid => {
    try {
      const uuidUpdate = await db.uuid.put({uuid: uuid})
      setUuid(uuid)
    } catch (error) {
    }  
  }

  const loadSave = async () => {
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      if(storedUuid[0] && storedGame[0]) {
        setUuid(storedUuid[0].uuid)
        setLobby(storedGame[0])
      } else {
      }
    } catch (error) {
    } 
  }
  
  useEffect(() => {
    loadSave()

    io.playerInit(locationGame, locationUuid)

    io.playerUuid((uuid) => {
      saveUuid(uuid)
    })

    io.gameUpdate(update => {
      updateGame(update)
    })

    return () => {
      io.disconnect()
    }
  }, [])

  const clearGame = () => {
    db.game.clear()
    db.uuid.clear()
  }

  const lobbyPlayers = lobby.players.map((player, ind) => (<li key={ ind } className={ player.uuid === uuid ? 'bg-blue-300' : ''}>{ player.name }</li>))

  return (
    <div className="p-8 flex-col flex-wrap items-center justify-center">
    <Link className="inline-block mt-2 p-1 mx-auto bg-green-300" to="/" onClick={ clearGame } >Clear Game</Link>
      <div>Code: { lobby.room }</div>
      <div>uuid: { uuid }</div>
      <ul>
        { lobbyPlayers }
      </ul>
    </div>
  )
}

export default Lobby