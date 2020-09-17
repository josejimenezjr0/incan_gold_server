import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import io from '../Socket'
import db from '../db'
import CenterBoard from './game/CenterBoard'
import PlayerBoard from './game/PlayerBoard'

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

  const lobbyPlayers = lobby.players.map((player, ind) => (<li key={ ind } className={ player.uuid === uuid ? 'bg-gray-300' : ''}>{ player.name }</li>))

  return (
    <div className="p-2 flex flex-col flex-wrap">
      {/*///// admin /////*/}
      <div className="flex p-1 bg-yellow-200 mr-auto">
        <button className="inline-block p-1 bg-gray-300" to="/" onClick={ clearGame } >Clear Game</button>
        <div className="p-1">Code: { lobby.room }</div>
        <div className="p-1">uuid: { uuid && uuid.substring(0, 4) }</div>
      </div>

      {/*///// game /////*/}
      <div className="p-1 flex flex-col flex-wrap justify-center bg-blue-100">
        <div className="text-lg text-center">Game</div>

        {/*///// player list /////*/}
        <ul className="flex flex-row justify-around">
          { lobbyPlayers }
        </ul>

        {/*///// center board /////*/}
        <CenterBoard />

        {/*///// player board /////*/}
        <PlayerBoard />
      </div>
    </div>
  )
}

export default Lobby