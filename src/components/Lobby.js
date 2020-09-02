import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import io from "socket.io-client"
const URL = 'http://127.0.0.1:4001'
const socket = io(URL)

const Lobby = () => {
  const { state: { game } } = useLocation()
  const [lobby, setLobby ] = useState({ code: '', players: [], size: 3 })

  useEffect(() => {
    game.newGame && socket.emit("create", game)
    !game.newGame && socket.emit("join", game)

    socket.on("update", game => {
      console.log('game: ', game)
      setLobby(game)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const lobbyPlayers = lobby.players.map((player, ind) => (<li key={ ind }>{ player.name }</li>))

  return (
    <div>
      <div>Code: { lobby.code }</div>
      <ul>
        { lobbyPlayers }
      </ul>
    </div>
  )
}

export default Lobby