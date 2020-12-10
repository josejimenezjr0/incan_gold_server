require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const socketServer = require('./socketServer')

let games = []

const setGames = gamesArray => games = gamesArray

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '/frontend/build')))

app.get('/games', (req, res) => {
  res.send(games)
})

app.post('/checkjoin', (req, res) => {
  console.log('req.body.room.toUpperCase(): ', req.body.room.toUpperCase());
  const found = games.filter(game => game.room === req.body.room.toUpperCase())
  res.status(200).send(!(games.length === 0 || found.length === 0))
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/build', 'index.html')))


socketServer(server, games, setGames, app)

const port = process.env.PORT
server.listen(port, () => console.log(`Listening on port ${port}`))