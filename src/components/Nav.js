import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="flex justify-between bg-red-300">
      <div><Link to="/">Home</Link></div>
      <div className="text-lg text-center"><Link to="/admin">Incan Gold</Link></div>
      <div></div>
    </div>
  )
}

export default Nav