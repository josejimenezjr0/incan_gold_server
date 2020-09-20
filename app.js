require('dotenv').config()
const express = require('express')
const chalk = require('chalk')

const app = express()
const server = require('http').createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const { 
  checkServerClient,
  clientReset,
  returningPlayer,
  socket_onCreate,
  socket_onDisconnect,
  socket_onJoin,
  socket_onChoice
} = require('./socket_actions')

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
  socket_onJoin(socket, players, games, io)
  socket_onDisconnect(socket, players, games, io)
  socket_onChoice(socket, players, games, io)
})