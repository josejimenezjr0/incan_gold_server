require('dotenv').config()
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { checkServerClient, clientReset, returningPlayer } = require('./socket_actions')
const socket_onCreate = require('./socket_create')

let games = {}
let players = {}

app.use(express.static('../client/public'))
app.get('/games', (req, res) => {
  res.send({ games, players })
})
app.get('/*', (req, res) => res.redirect('/'))

const port = process.env.PORT

server.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))

////// Socket.io server config //////

io.use(checkServerClient(players))

io.on("connect", (socket) => {
  if(clientReset(socket)) return

  returningPlayer(socket, players, games, io)

  socket_onCreate(socket, players, games)

  socket.on("disconnect", () => {
    if(Object.keys(players).length === 0) return
    const matchID = socket.id
    const result = Object.entries(players).find(([id, { socket }]) => socket == matchID )
    const id = result[0]
    const room = result[1].room
    console.log(chalk.red.bold(`${chalk.bgRed.black.bold(` ${id.substring(0, 4)} `)} disconnected from room: ${chalk.bgRed.black.bold(` ${room} `)}`))
    games[room].players.map(player => {
      if(player.uuid == id) player.online = false
    })
    io.to(room).emit("update", { ...games[room], deck: null } )
  })

  socket.on("join", async ({ name, code: room }) => {
    console.log('received join')
    const uuid = uuidv4()
    socket.emit("uuid",  uuid )

    if(games[room]) {
      players[uuid] =
        { name,
          room: room,
          socket: socket.id,
          host: false,
          totalScore: 0,
          roundScore: 0,
          artifacts: [],
          choiceMade: false,
          choice: null 
        }
      games[room].players = [
        ...games[room].players,
        { name: name,
          uuid: uuid, 
          online: true,
          roundScore: 0, 
          artifacts: [],
          choiceMade: false,
          choice: null } 
        ]
      socket.join(room)
      io.to(room).emit("update", { ...games[room], deck: null } )
      socket.emit("playerUpdate", players[uuid])
    } else console.log('Game not found')
  })

  socket.on("choice", async ({ uuid, choice }) => {
    if(!players[uuid]) {
      socket.emit('forceReset')
      return
    }
    players[uuid] = { ...players[uuid], choice, choiceMade: true }
    games[players[uuid].room].players.map(player => {
      if(player.uuid == uuid) player.choiceMade = true
    })
    io.to(players[uuid].room).emit("update", { ...games[players[uuid].room], deck: null } )
  })

  // socket.on("disconnected", data => {
  //   console.log('disconnected')
  // })
})