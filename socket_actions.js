const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')
const { makePlayer_Game } = require('./lib/gameAssets')

/**
 * Takes socket handshake query paramater and
 * checks if the server has been restarted (players object empty)
 * or checks if client is returning and attaches uuid if found.
 */
const checkServerClient = players => {
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

/**
 * If client needs to be reset emits a force reset command to client socket
 * and returns true to socket 'connect' function to stop any other actions.
 */
const clientReset = socket => {
  if(socket.reset) {
    console.log(chalk.bgRed.white.bold("Force Reset"))
    socket.emit('forceReset')
    return true
  } else return false
}

/**
 * If a uuid is present then a player is returning and their socket ID will be updated.
 * They rejoin their socket room and saved game and their online status is updated.
 */
const returningPlayer = (socket, players, games, io) => {
  const { uuid, id} = socket
  if(!uuid) return
  const gameRoom = players[uuid].room
  console.log(chalk.green(`${chalk.bgGreen.black.bold(` ${uuid.substring(0,4)} `)} returned to room: ${chalk.bgGreen.black.bold(` ${gameRoom} `)}`))
  socket.join(gameRoom)
  players[uuid].socket = id
  games[gameRoom].players.map(player => {
    if(player.uuid == uuid) player.online = true
  })
  io.to(gameRoom).emit("update", { ...games[gameRoom], deck: null } )
}

const socket_onCreate = (socket, players, games) => {
  return socket.on("create", startInfo => {
    const uuid = uuidv4()
    socket.emit("uuid", uuid)
    const room = Math.random().toString(36).substring(2, 6)
    console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)

    //verify same room name doesn't already exist
    if (!games.hasOwnProperty(room)) {
      [players[uuid], games[room]] = makePlayer_Game(startInfo, uuid, room, socket.id)

      //add socket to created game/room and send back game info minus deck
      socket.join(room)
      socket.emit("update", { ...games[room], deck: null })
      socket.emit("playerUpdate", players[uuid])
    } else console.log('Room name already exists')
  })
}

const socket_onJoin = (socket, players, games, io) => {
  return socket.on("join", startInfo => {
    const uuid = uuidv4()
    socket.emit("uuid",  uuid )
    const { code: room } = startInfo
    console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)

    // check if game exists
    if(games[room]) {
      let addPlayer 
      [players[uuid], addPlayer] = makePlayer_Game(startInfo, uuid, room, socket.id)
      games[room].players = [...games[room].players, addPlayer]

      //add socket to already made game/room and send back game info minus deck
      socket.join(room)
      io.to(room).emit("update", { ...games[room], deck: null } )
      socket.emit("playerUpdate", players[uuid])
    } else console.log('Game not found')
  })
}

const socket_onChoice = (socket, players, games, io) => {
  return socket.on("choice", ({ uuid, choice }) => {
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
}

const socket_onDisconnect = (socket, players, games, io) => {
  return socket.on("disconnect", () => {
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
}

module.exports = {
  checkServerClient,
  clientReset,
  returningPlayer,
  socket_onCreate,
  socket_onDisconnect,
  socket_onJoin,
  socket_onChoice
}