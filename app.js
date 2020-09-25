require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const socketServer = require('./socketServer')

let games = []

const setGames = gamesArray => games = gamesArray

app.use(bodyParser.json())
app.use(express.static('../client/public'))
app.get('/games', (req, res) => {
  res.send(games)
})

app.get('/*', (req, res) => res.redirect('/'))

socketServer(server, games, setGames, app)

const port = process.env.PORT
server.listen(port, () => console.log(`Listening on port ${port}`))