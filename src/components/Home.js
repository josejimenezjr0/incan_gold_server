import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
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