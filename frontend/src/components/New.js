import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const New = () => {
  const [ game, setGame ] = useState({ name: '', size: 3, init: true, join: false })

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(prevGame => ({
      ...prevGame,
      [name]: value 
    }))
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs mt-8">
        <div className="shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <p className="block text-gray-700 font-bold mb-2">Name</p>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" type="text" placeholder="enter name" value={ game.name } onChange={ handleInput }/>
          </div>
          <div className="mb-4">
            <p className="block text-gray-700 font-bold mb-2">Players</p>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="size" type="number" placeholder="3" value={ game.size } onChange={ handleInput }/>
          </div>
          <div className="flex items-center justify-center">
            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to={{ pathname: "/lobby", state: { game: game } }} >Make Game!</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New