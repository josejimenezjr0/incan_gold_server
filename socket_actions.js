const chalk = require('chalk')

/**
 * Takes socket handshake query paramater and
 * checks if the server has been restarted (players object empty)
 * or checks if client is returning and attaches uuid if found.
 */
const checkServerClient = players => {
  return (socket, next) => {
    if(socket.handshake.query.reconnect) {
      if(Object.keys(players).length === 0) {
        socket.reset = true
        return next()
      }
      console.log(chalk.yellow(`${ chalk.bgYellow.black.bold(` ${ socket.handshake.query.reconnect.substring(0, 4) } `) } reconnected`))
      socket.uuid = socket.handshake.query.reconnect
      return next()
    } else return next();
  }
}

/**
 * If client needs to be reset emits a force reset command to client socket
 * and returns true to socket 'connect' function to stop any other actions.
 */
const clientReset  = socket => {
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

module.exports = {
  checkServerClient,
  clientReset,
  returningPlayer
}