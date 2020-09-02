require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let games = []

io.on("connect", (socket) => {
  console.log("New client connected")

  socket.on("create", async ({ name, players }) => {
    console.log('create: ', ({ name, players }))
    console.log('games: ', games)
    const room = Math.random().toString(36).substring(2, 6)
    if (games.filter(({ code }) => code === room).length === 0) {
      const newGame = { code: room, players: [{ name: name, id: socket.id }], size: players }
      games = [...games, newGame]
      console.log('games: ', games)
      socket.join(room)
      io.to(room).emit("update", newGame )
    } else {
      console.log('Room name already exists')
    }
    
  })

  socket.on("disconnect", () => {
    console.log(`Client: ${socket.id} disconnected`);
  })

  socket.on("join", async ({ name, code: room }) => {
    console.log('join:', ({ name, room }))
    console.log('games: ', games)
    let newJoin
    const findGame = games.filter(({ code }) => code === room)
    if(findGame) {
      newJoin = { ...findGame[0], players: [...findGame[0].players, { name: name, id: socket.id }] }
      games = games.filter(({ code }) => code != room)
      games = [...games, newJoin]
    }
    console.log('games: ', games)
    socket.join(room)
    io.to(room).emit("update", newJoin )
  })
})

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))