import React, { useState, useEffect } from "react"
import io from "socket.io-client"
const URL = 'http://127.0.0.1:4001'
import Home from './components/Home'

const App = () => {

  const socket = io(URL)

  const handleClick = () => {
    socket.emit("hello", new Date())
  }

  return (
    <Home socket={ socket } handleClick={ handleClick }/>
  )
}

export default App