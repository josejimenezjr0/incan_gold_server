import io from 'socket.io-client'
let socket

const playerInit = (game, uuid) => {
  if(game.init) {
    socket = io('http://192.168.86.21:4001')
    socket.emit(game.join ? 'join' : 'create', game)
  } else {
    socket = io(`http://192.168.86.21:4001?reconnect=${uuid}`)
  }
}

const gameUpdate = handleUpdate => {
  socket.on('update', update => handleUpdate(update))
}

const playerUuid = uuidSet => {
  socket.on('uuid', uuid => uuidSet(uuid))
}

const disconnect = () => socket.disconnect()

export default {
  playerInit,
  gameUpdate,
  playerUuid,
  disconnect
}