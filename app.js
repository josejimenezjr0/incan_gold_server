require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on("connection", (socket) => {
  console.log("New client connected")
  socket.emit("hello", new Date())

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  })

  socket.on("hello", data => {
    console.log(data)
    socket.emit("hello", new Date())
  })
})

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))