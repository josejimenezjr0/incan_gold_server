import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="flex justify-center bg-blue-200 p-2">
      {/* <Link to="/">Home</Link> */}
      <Link to="/" className="text-lg font-bold tracking-wide text-center">Incan Gold</Link>
    </div>
  )
}

export default Nav