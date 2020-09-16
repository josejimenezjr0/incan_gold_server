require('dotenv').config()
const express = require('express')
const { v4: uuidv4 } = require('uuid')


const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let games = {}
let players = {}

app.use(express.static('../client/public'))
app.get('/games', (req, res) => {
  res.send({ games, players })
})
app.get('/*', (req, res) => res.redirect('/'))

io.use((socket, next) => {
  if(socket.handshake.query.reconnect) {
    console.log(`reconnect`, socket.handshake.query.reconnect)
    socket.uuid = socket.handshake.query.reconnect
    console.log('socket.uuid: ', socket.uuid);
    return next()
  } else return next();
})

io.on("connect", (socket) => {
  console.log(`New Client: ${socket.id} connected`)

  if(socket.uuid) {
    console.log('returning player')
    players[socket.uuid].socket = socket.id
  }

  socket.on("create", async ({ name, playerNum }) => {
    const uuid = uuidv4()
    socket.emit("uuid",  uuid )
    const room = Math.random().toString(36).substring(2, 6)

    //verify same room name doesn't already exist
    if (!games.hasOwnProperty(room)) {
      //add player and create game
      players[uuid] = { name: name, room: room, socket: socket.id, host: true }
      games[room] = { room, players: [{ name: name, uuid: uuid }], size: playerNum }

      //add socket to created game and send back game info
      socket.join(room)
      socket.emit("update", games[room])
      console.log('CREATE', games)
    } else console.log('Room name already exists')
  })

  socket.on("disconnect", () => {
    console.log(`Client: ${socket.id} disconnected`);
  })

  socket.on("join", async ({ name, code: room }) => {
    console.log('received join')
    const uuid = uuidv4()
    socket.emit("uuid",  uuid )

    if(games[room]) {
      players[uuid] = { name: name, room: room, socket: socket.id, host: false }
      games[room].players = [ ...games[room].players, { name: name, uuid: uuid } ]
      console.log('JOIN games: ', games)
      console.log('JOIN players: ', players)
      socket.join(room)
      io.to(room).emit("update", games[room] )
    } else console.log('Game not found')

  })

  socket.on("disconnected", data => {
    console.log('disconnected')
  })
})

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))