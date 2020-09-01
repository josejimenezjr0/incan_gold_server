import React, { useState, useEffect } from "react"
import io from "socket.io-client"

const Home = ({ socket, handleClick }) => {
  const [ res, setRes ] = useState('hello')

  socket.on("hello", data => {
    setRes(data)
  })

  return (
    <div className="bg-gray-500">
      <div>{res}</div>
      <button type="button" onClick={ handleClick }>hello</button>
    </div>
  )
}

export default Home