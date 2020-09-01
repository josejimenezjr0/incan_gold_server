require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on("connect", (socket) => {
  console.log("New client connected")

  socket.on("join", async room => {
    console.log('room: ', room);
    socket.join(room)
    io.to(room).emit("newJoin", { room, who: socket.id })
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  })

  socket.on("message", async data => {
    console.log(data)
    io.to(data.room).emit("sentMessage", { date: new Date(), from: socket.id, message: data.message } )
  })
})

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))