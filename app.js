require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketServer = require('./socketServer')

let games = {}
let players = {}

app.use(express.static('../client/public'))
app.get('/games', (req, res) => res.send({ games, players }))
app.get('/*', (req, res) => res.redirect('/'))

socketServer(server, games, players)

const port = process.env.PORT
server.listen(port, () => console.log(`Listening on port ${port}`))