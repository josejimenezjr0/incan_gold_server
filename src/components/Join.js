import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Join = () => {
  const [ game, setGame ] = useState({ name: '', code: '', init: true, join: true })

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(prevGame => ({
      ...prevGame,
      [name]: value 
    }))
  }

  return (
    <div>
      <div className="text-center bg-gray-300">Join</div>
      <div className="flex justify-around bg-gray-200">
        <input type="text" name="code" placeholder="enter code" value={ game.code } onChange={ handleInput }/>
        <input type="text" name="name" placeholder="enter your name" value={ game.name } onChange={ handleInput }/>
      </div>
      <Link to={{ pathname: "/lobby", state: { game: game } }}>Join Game!</Link>
    </div>
  )
}

export default Join