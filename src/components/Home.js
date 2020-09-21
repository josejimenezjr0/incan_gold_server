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
    <div>
      <div className="flex justify-around">
        <Link to="/new">New</Link>
        <Link to="/join">Join</Link>
      </div>
    </div>
  )
}

export default Home