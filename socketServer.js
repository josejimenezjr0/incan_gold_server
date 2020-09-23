const socketio = require('socket.io')
const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')
const { makePlayer_Game, hideInfo, playerInfo, startRound } = require('./lib/gameAssets')

module.exports = (server, games) => {
  const io = socketio(server)

  const updateGames = (update, room) => {
    const keepGames = games.filter(game => game.room !== room)
    games = [...keepGames, update]
  }

  /**
   * If player empty OR players doesn't have uuid
   */
  const clientCheck = (filter, value) => {
    const found = games.map(game => game.players).flat().filter(player => player[filter] == value)
    const result = games.length === 0 || found.length === 0
    return result
  }

  /**
   * Socket middleware - Check for reconnect flag and if the server has been restarted (players empty or no client uuid)
   * sets reset flag otherwise checks if client is returning and attaches uuid.
   */
  const checkServerClient = () => {
    return (socket, next) => {
      const uuid = socket.handshake.query.reconnect
      if(uuid) {
        if(clientCheck('uuid', uuid)) {
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
      //TODO
      // if(players[uuid].timer) {
      //   console.log('clearing timer')
      //   clearTimeout(players[uuid].timer)
      //   }
      const [currentGame] = games.filter(game => game.players.some(player => player.uuid == uuid))
      const [currentPlayer] = currentGame.players.filter(player => player.uuid == uuid)
      const { room } = currentGame

      const playerUpdate = { ...currentPlayer, socketID: id, online: true }
      const keepPlayers = currentGame.players.filter(player => player.uuid !== uuid)
      const gameUpdate = { ...currentGame, players: [...keepPlayers, playerUpdate] }

      socket.join(room)
      io.to(room).emit("update", hideInfo(gameUpdate, false))
      
      updateGames(gameUpdate, room)
      console.log(chalk.green(`${chalk.bgGreen.black.bold(` ${uuid.substring(0,4)} `)} returned to room: ${chalk.bgGreen.black.bold(` ${room} `)}`))
    }

    
    socket.on("create", startInfo => {
      console.log('startInfo: ', startInfo);
      const uuid = uuidv4()
      socket.emit("uuid", uuid)
      if(startInfo.join) {
        const [currentGame] = games.filter(game => game.room === startInfo.code)
        const room = startInfo.code

        const gameUpdate = makePlayer_Game(startInfo, uuid, room, socket.id, currentGame)

        socket.join(room)
        io.to(room).emit("update", hideInfo(gameUpdate, false))
        socket.emit("playerUpdate", playerInfo(gameUpdate, uuid))

        updateGames(gameUpdate, room)
        console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)
      } else {
        const room = Math.random().toString(36).substring(2, 6)

        const gameUpdate = makePlayer_Game(startInfo, uuid, room, socket.id)
        
        socket.join(room)
        io.to(room).emit("update", hideInfo(gameUpdate, false))
        socket.emit("playerUpdate", playerInfo(gameUpdate, uuid))

        updateGames(gameUpdate, room)
        console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and game room: }{bgGreen.black.bold  ${room} } was created`)
      }
    })

    // Updates game with player choice selection and sends update to other players in the game
    socket.on("choice", ({ uuid, choice }) => {
      if(clientCheck('uuid', uuid)) {
        socket.emit('forceReset')
        return
      }

      const [currentGame] = games.filter(game => game.players.some(player => player.uuid == uuid))
      const [currentPlayer] = currentGame.players.filter(player => player.uuid == uuid)
      const { room } = currentGame

      const playerUpdate = { ...currentPlayer, choice, choiceMade: true }
      const keepPlayers = currentGame.players.filter(player => player.uuid !== uuid)
      const gameUpdate = { ...currentGame, players: [...keepPlayers, playerUpdate] }

      socket.emit("playerUpdate", playerInfo(gameUpdate, uuid))

      updateGames(gameUpdate, room)
      console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green submitted choice: }{bgGreen.black.bold  ${choice} }`)
    })

    socket.on("startRound", room => {
      const [currentGame] = games.filter(game => game.room == room)
      console.log('currentGame: ', currentGame);

      const gameUpdate = startRound(currentGame, currentGame.players)
      console.log('gameUpdate: ', gameUpdate);

      io.to(room).emit("update", hideInfo(gameUpdate, true))
      console.log(`hideInfo`, hideInfo(gameUpdate, true))

      updateGames(gameUpdate, room)
      console.log(chalk`{bgGreen.black.bold  ${room} }{green started round}`)
    })

    //Sets disconnected player to offline status and sends status to remaining players in game
    socket.on("disconnect", () => {
      if(clientCheck('socketID', socket.id)) return
      const [currentGame] = games.filter(game => game.players.some(player => player.socketID == socket.id))
      const [currentPlayer] = currentGame.players.filter(player => player.socketID == socket.id)
      const { room } = currentGame
      const { uuid } = currentPlayer

      const playerUpdate = { ...currentPlayer, online: false }
      const keepPlayers = currentGame.players.filter(player => player.uuid !== uuid)
      const gameUpdate = { ...currentGame, players: [...keepPlayers, playerUpdate] }

      io.to(room).emit("update", hideInfo(gameUpdate, false))

      updateGames(gameUpdate, room)
      console.log(chalk.red.bold(`${chalk.bgRed.black.bold(` ${uuid.substring(0, 4)} `)} disconnected from room: ${chalk.bgRed.black.bold(` ${room} `)}`))
      ///TODO
      // players[uuid].timer = setTimeout(() => {
      //   games[room].players[uuid].online = false
      //   io.to(room).emit("update", { ...games[room], deck: null } )
      // }, 10000)
    })
  })
}