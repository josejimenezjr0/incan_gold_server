require('dotenv').config()
const path = require('path')
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

let games = []
const tokenSecret = process.env.SECRET

const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('../client/public'))
app.get('/games', (req, res) => res.send(games))
// app.get('/*', (req, res) => res.sendFile('index.html', { root: path.join(__dirname, '../client/public/') }))
app.get('/*', (req, res) => res.redirect('/'))

app.use(bodyParser.json());

io.on("connect", (socket) => {
  console.log(`New Client: ${socket.id} connected`)

  socket.on("create", async ({ name, players }) => {
    console.log('create: ', ({ name, players }))
    console.log('games: ', games)
    const room = Math.random().toString(36).substring(2, 6)
    if (!games.find(({ code }) => code === room)) {
      const accessToken = jwt.sign({ name: name, code: room }, tokenSecret)
      console.log('accessToken: ', accessToken)
      const newGame = { code: room, players: [{ name: name, id: socket.id, accessToken: accessToken }], size: players }
      games = [...games, newGame]
      console.log('games: ', games)
      socket.join(room)
      io.to(room).emit("update", newGame )
    } else console.log('Room name already exists')
    
  })

  socket.on("disconnect", () => {
    console.log(`Client: ${socket.id} disconnected`);
  })

  socket.on("join", async ({ name, code: room }) => {
    console.log('join:', ({ name, room }))
    console.log('games: ', games)
    const gamesIndex = games.findIndex(({ code }) => code === room)
    if(gamesIndex !== -1) {
      let newGames = [...games]
      newGames[gamesIndex] = { ...newGames[gamesIndex], players: [...newGames[gamesIndex].players, { name: name, id: socket.id }] }
      // games = [ ...games, games[gamesIndex] = { ...games[gamesIndex], players: [...games[gamesIndex].players, { name: name, id: socket.id }] }]
      games = newGames
      console.log('games: ', games)
      socket.join(room)
      io.to(room).emit("update", games[gamesIndex] )
    } else console.log('Game not found')

  })
})

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))