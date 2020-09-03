import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import io from "socket.io-client"
const URL = 'http://127.0.0.1:4001'
const socket = io(URL)

const Lobby = () => {
  const location = useLocation()
  const game = location.state && location.state.game

  const [lobby, setLobby ] = useState({ code: '', players: [], size: 3 })

  const history = useHistory()

  useEffect(() => {
    if(!game) history.push('/')

    const storedGame = localStorage.getItem('incanGold')

    if(!storedGame) {
      game.newGame && socket.emit("create", game)
      !game.newGame && socket.emit("join", game)

      socket.on("update", game => {
        console.log('game: ', game)
        setLobby(game)
        localStorage.setItem('incanGold', JSON.stringify(game))
      })
    } else {
      setLobby(JSON.parse(storedGame))
    }
    

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