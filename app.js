require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketServer = require('./socketServer')

let games = []

app.use(express.static('../client/public'))
app.get('/games', (req, res) => {
  res.json(games)
})
app.get('/*', (req, res) => res.redirect('/'))

socketServer(server, games)

const port = process.env.PORT
server.listen(port, () => console.log(`Listening on port ${port}`))