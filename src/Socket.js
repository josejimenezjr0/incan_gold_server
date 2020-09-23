import io from 'socket.io-client'
let socket

const playerInit = (game, uuid) => {
  if(game.init) {
    socket = io('http://192.168.86.21:4001')
    // socket.emit(game.join ? 'join' : 'create', game)
    socket.emit('create', game)
  } else {
    socket = io(`http://192.168.86.21:4001?reconnect=${uuid}`)
  }
}

const gameUpdate = handleUpdate => {
  socket.on('update', update => {
    // console.log(`gameUpdate`, update)
    handleUpdate(update)
  })
}

const playerUuid = uuidSet => {
  socket.on('uuid', uuid => uuidSet(uuid))
}

const playerUpdate = handlePlayerUpdate => {
  socket.on('playerUpdate', update => {
    // console.log(`playerUpdate`, update)
    handlePlayerUpdate(update)
  })
}

const sendChoice = choice => {
  console.log(`sendChoice`, choice)
  socket.emit('choice', choice)
}

const startRound = room => {
  socket.emit('startRound', room)
  }

const gameReset = resetGame => {
  socket.on('forceReset', () => resetGame())
}

const disconnect = () => socket.disconnect()

export default {
  playerInit,
  gameUpdate,
  playerUuid,
  disconnect,
  gameReset,
  playerUpdate,
  sendChoice,
  startRound
}