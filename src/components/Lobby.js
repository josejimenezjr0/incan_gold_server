import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import io from "socket.io-client"
const socket = io()

const Lobby = () => {
  const location = useLocation()
  const locationGame = location.state && location.state.game
  const storedGame = localStorage.getItem('incanGold')
  const [lobby, setLobby ] = useState({ code: '', players: [], size: 3, })

  socket.on("update", game => {
    console.log('storedGame: ', storedGame);
    game.players.length === 1 ? game.uuid = game.players[0].id : game.uuid = storedGame.uuid
    setLobby(game)
    localStorage.setItem('incanGold', JSON.stringify(game))
  })
  
  useEffect(() => {
    if(!storedGame) {
      locationGame.newGame && socket.emit("create", locationGame)
      !locationGame.newGame && socket.emit("join", locationGame)
    } else {
      setLobby(JSON.parse(storedGame))
      socket.emit("rejoin", storedGame)

      console.log('rejoin locationGame: ', storedGame);
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  const clearGame = () => localStorage.clear()

  const lobbyPlayers = lobby.players.map((player, ind) => (<li key={ ind }>{ player.name }</li>))

  return (
    <div className="p-8 flex-col flex-wrap items-center justify-center">
    <Link className="inline-block mt-2 p-1 mx-auto bg-green-300" to="/" onClick={clearGame} >Clear Game</Link>
      <div>Code: { lobby.code }</div>
      <ul>
        { lobbyPlayers }
      </ul>
    </div>
  )
}

export default Lobby