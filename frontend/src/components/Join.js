import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Join = () => {
  const history = useHistory()
  const [game, setGame] = useState({ name: '', code: '', init: true, join: true })
  const [joinInfo, setJoinInfo] = useState({ found: true, checking: false })

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(prevGame => ({ ...prevGame, [name]: value }))
  }

  const checkJoin = async room => {
    setJoinInfo({ ...joinInfo, checking: true })
    console.log('sent checkJoin')
    try {
      const res = await axios.post('/checkjoin', { room: room })
      setJoinInfo({ found: res.data, checking: false })
      if(res.data) history.push({ pathname: "/lobby", state: { game: game } })
    } catch (error) {
      console.log(error)
    }
    
  }

  const allInfo = game.name === '' || game.code === ''
  const cssDisabled = 'opacity-50 cursor-not-allowed'

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs mt-8">
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <div className="mb-4">
            <p className="block text-gray-700 font-bold mb-2">Name</p>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" placeholder="enter name" value={ game.name } onChange={ handleInput }/>
          </div>
          <div className="mb-4">
            <p className="block text-gray-700 font-bold mb-2">Code</p>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="code" placeholder="enter code" value={ game.code } onChange={ handleInput }/>
          </div>
          <div className="flex items-center justify-center">
            <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${allInfo && cssDisabled }`} disabled={ allInfo } onClick={ () => checkJoin(game.code) }>Join Game!</button>
          </div>
        </div>
        <div className="flex items-center justify-center">
        { !joinInfo.found && <div className={`bg-red-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Game not found.</div> }
        { joinInfo.checking && <div className={`bg-orange-300 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Searching...</div> }
        </div>
      </div>
    </div>
  )
}

export default Join