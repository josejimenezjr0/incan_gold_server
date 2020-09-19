require('dotenv').config()
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let games = {}
let players = {}

const createGame = () => {
  const hazards = [...Array(15)].map((_, index) => ({ card: 'HazardQuestCard', type: Math.ceil((index + 1) / 3), removed: false }))
  const values = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17]
  const treasures = values.map(value => ({ card: 'TreasureQuestCard', value }))
  const quest = [{ card: 'ArtifactQuestCard', value: null }, ...hazards, ...treasures].sort(() => Math.random() - .5)
  return quest
}

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
    const matchID = socket.uuid
    const room = players[matchID].room
    console.log('room: ', room);
    console.log('matchID: ', matchID);
    console.log('returning player')
    // if(!players.hasOwnProperty('socket.uuid')) {
    //   console.log("FORCE RESET!!!")
    //   socket.emit('forceReset')
    //   return
    // }
    socket.join(room)
    players[matchID].socket = socket.id
    games[room].players.map(player => {
      if(player.uuid == matchID) player.online = true
    })
    io.to(room).emit("update", { ...games[room], deck: null } )
    ///////////////////////////////////////////
  }

  socket.on("create", async ({ name, playerNum }) => {
    const uuid = uuidv4()
    socket.emit("uuid",  uuid )
    const room = Math.random().toString(36).substring(2, 6)

    //verify same room name doesn't already exist
    if (!games.hasOwnProperty(room)) {
      const deck = createGame()
      const quest = [deck[0]]
      //add player and create game
      players[uuid] = 
        { name,
          room: room,
          socket: socket.id,
          host: true,
          totalScore: 0,
          roundScore: 0,
          artifacts: [],
          choiceMade: false,
          choice: null 
        }
      games[room] =
        { room,
        players: [
          { name: name,
            uuid: uuid, 
            online: true,
            roundScore: 0,
            artifacts: [],
            choiceMade: false,
            choice: null }
          ],
        size: playerNum,
        board: {
          round: 1,
          quest
        },
        deck }

      //add socket to created game and send back game info
      socket.join(room)
      socket.emit("update", { ...games[room], deck: null })
      socket.emit("playerUpdate", players[uuid])
      console.log(`players[uuid]`, players[uuid])
    } else console.log('Room name already exists')
  })

  socket.on("disconnect", () => {
    console.log(`Client: ${socket.id} disconnected`)
    const matchID = socket.id
    const result = Object.entries(players).find(([id, { socket }]) => socket == matchID )
    const id = result[0]
    const room = result[1].room
    console.log('room: ', room);
    console.log('id: ', id)
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

const port = process.env.PORT

server.listen(port, () => console.log(`Listening on port ${port}`))