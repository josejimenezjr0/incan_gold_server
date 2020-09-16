import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const New = () => {
  const [ game, setGame ] = useState({ name: '', playerNum: 3, init: true, join: false })

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(prevGame => ({
      ...prevGame,
      [name]: value 
    }))
  }

  return (
    <div className="p-8 flex-col flex-wrap items-center justify-center">
      <div className="p-2 bg-gray-300">New</div>
      <div className="flex justify-around mt-2">
        <div>
          <p className="inline-block pr-4">Your Name:</p>
          <input type="text" name="name" placeholder="enter your name" value={ game.name } onChange={ handleInput }/>
        </div>
        <div>
          <p className="inline-block pr-4">Players:</p>
          <input type="number" name="playerNum" placeholder="3" value={ game.playerNum } onChange={ handleInput }/>
        </div>
      </div>
      <Link className="inline-block mt-2 p-1 mx-auto bg-green-300" to={{ pathname: "/lobby", state: { game: game } }}>Make Game!</Link>
    </div>
  )
}

export default New