const socketio = require('socket.io')
const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')
const { makePlayer_Game } = require('./lib/gameAssets')

module.exports = (server, games, players) => {
  const io = socketio(server)

  /**
   * Socket middleware - Check for reconnect flag and if the server has been restarted (players empty or no client uuid)
   * sets reset flag otherwise checks if client is returning and attaches uuid.
   */
  const checkServerClient = () => {
    return (socket, next) => {
      const uuid = socket.handshake.query.reconnect
      if(uuid) {
        if(Object.keys(players).length === 0 || !players.hasOwnProperty(uuid)) {
          socket.reset = true
          return next()
        }
        console.log(chalk.yellow(`${ chalk.bgYellow.black.bold(` ${ uuid.substring(0, 4) } `) } reconnected`))
        socket.uuid = uuid
        return next()
      } else return next();
    }
  }

  io.use(checkServerClient())

  io.on("connect", socket => {
    const { uuid, id, reset } = socket

    // If client needs to be reset emits a force reset command to client socket and stops
    if(reset) {
      console.log(chalk.bgRed.white.bold("Force Reset"))
      socket.emit('forceReset')
      return
    }

    // Returning player socketID updated. Player rejoins saved game and online status is updated.
    if(uuid) {
      const { room } = players[uuid]
      console.log(chalk.green(`${chalk.bgGreen.black.bold(` ${uuid.substring(0,4)} `)} returned to room: ${chalk.bgGreen.black.bold(` ${room} `)}`))
      socket.join(room)
      players[uuid].socket = id
      games[room].players.map(player => {
        if(player.uuid == uuid) player.online = true
      })
      io.to(room).emit("update", { ...games[room], deck: null } )
    }

    // Creates a new player and new game. Adds player to the new game and sends out game info
    socket.on("create", startInfo => {
      const uuid = uuidv4()
      socket.emit("uuid", uuid)
      const room = Math.random().toString(36).substring(2, 6)
      console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)

      // verify same room name doesn't already exist
      if (!games.hasOwnProperty(room)) {
        [players[uuid], games[room]] = makePlayer_Game(startInfo, uuid, room, socket.id)

        // add socket to created game/room and send back game info minus deck
        socket.join(room)
        socket.emit("update", { ...games[room], deck: null })
        socket.emit("playerUpdate", players[uuid])
      } else console.log('Room name already exists')
    })

    // Creates a new player and adds that player to an existing game
    socket.on("join", startInfo => {
      const uuid = uuidv4()
      socket.emit("uuid",  uuid )
      const { code: room } = startInfo
      console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)

      // check if game exists
      if(games[room]) {
        let addPlayer 
        [players[uuid], addPlayer] = makePlayer_Game(startInfo, uuid, room, socket.id)
        games[room].players = [...games[room].players, addPlayer]

        // add socket to already made game/room and send back game info minus deck
        socket.join(room)
        io.to(room).emit("update", { ...games[room], deck: null } )
        socket.emit("playerUpdate", players[uuid])
      } else console.log('Game not found')
    })

    // Updates game with player choice selection and sends update to other players in the game
    socket.on("choice", ({ uuid, choice }) => {
      // Server restarted but client has saved game
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

    //Sets disconnected player to offline status and sends status to remaining players in game
    socket.on("disconnect", () => {
      const matchID = socket.id
      const result = Object.entries(players).find(([id, { socket }]) => socket == matchID )
      if(Object.keys(players).length === 0 || !result) return
      const uuid = result[0]
      const room = result[1].room
      console.log(chalk.red.bold(`${chalk.bgRed.black.bold(` ${uuid.substring(0, 4)} `)} disconnected from room: ${chalk.bgRed.black.bold(` ${room} `)}`))
      games[room].players.map(player => {
        if(player.uuid == uuid) player.online = false
      })
      io.to(room).emit("update", { ...games[room], deck: null } )
    })
  })
}