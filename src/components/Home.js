import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import MessageBoard from "./MessageBoard"
const URL = 'http://127.0.0.1:4001'
const socket = io(URL)

const Home = () => {
  const [ room, setRoom ] = useState('')
  const [ input, setInput ] = useState('')
  const [ messageBoard, setMessageBoard ] = useState([])

  useEffect(() => {
    socket.emit("join", Math.random().toString(36).substring(2, 6))
    socket.on("newJoin", ({ room, who }) => {
      setRoom(room)
    })

    socket.on("sentMessage", ({ date, from, message }) => {
      setMessageBoard(cur => [ ...cur, { date, from, message } ])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleClick = () => {
    input.trim() != '' && socket.emit("message", { message: input, room: room })
    setInput('')
  }

  const handleInput = e => {
    setInput(e.target.value)
  }

  return (
    <div>
      <input className="bg-gray-200" type="text" placeholder="type message" value={ input } onChange={ handleInput }/>
      <button className="block bg-blue-300" type="button" onClick={ handleClick }>Send</button>
      <MessageBoard messages={ messageBoard } />
    </div>
  )
}

export default Home