import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const New = () => {
  const [ game, setGame ] = useState({ name: '', players: 3, newGame: true })

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(prevGame => ({
      ...prevGame,
      [name]: value 
    }))
  }

  return (
    <div>
      <div className="text-center bg-gray-300">New</div>
      <div className="flex justify-around bg-gray-200">
        <input type="text" name="name" placeholder="enter your name" value={ game.name } onChange={ handleInput }/>
        <input type="number" name="players" placeholder="3" value={ game.players } onChange={ handleInput }/>
      </div>
      <Link to={{ pathname: "/lobby", state: { game: game } }}>Make Game!</Link>
    </div>
  )
}

export default New