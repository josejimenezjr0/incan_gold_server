import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import db from '../db'

const Home = () => {
  const history = useHistory()
  const checkDB = async () => {
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      const storedPlayer = await db.table('player').toArray()
      if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
        history.push({ pathname:'/lobby', state: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0]} })
      } else {
        console.log('Missing some or all info, starting new');
      }
    } catch (error) {
    } 
  }

  useEffect(() => {
    checkDB()
  }, [])

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs mt-8">
        <div className="flex justify-around shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <Link className="bg-blue-400 hover:bg-blue-600 text-gray-900 tracking-wide font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to="/new" >New</Link>
          </div>
          <div className="mb-4">
            <Link className="bg-blue-400 hover:bg-blue-600 text-gray-900 tracking-wide font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to="/join" >Join</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home