import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

const Home = () => {
  const history = useHistory()

  useEffect(()=> {
    const storedGame = localStorage.getItem('incanGold')
    if(storedGame) history.push('/lobby')
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