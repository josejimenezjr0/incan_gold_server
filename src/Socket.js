import io from 'socket.io-client'
let socket

const playerInit = (game, uuid) => {
  if(game.init) {
    socket = io('http://192.168.86.21:4001')
    socket.emit('create', game)
  } else {
    socket = io(`http://192.168.86.21:4001?reconnect=${uuid}`)
  }
}

const gameUpdate = handleUpdate => {
  socket.on('update', update => {
    console.log(`gameUpdate`)
    handleUpdate(update)
  })
}

const playerUuid = uuidSet => {
  socket.on('uuid', uuid => {
    console.log('uuid')
    uuidSet(uuid)
  }) 
}

const playerUpdate = handlePlayerUpdate => {
  socket.on('playerUpdate', update => {
    console.log(`playerUpdate`)
    handlePlayerUpdate(update)
  })
}

const sendChoice = choice => {
  console.log(`sendChoice`, choice)
  socket.emit('choice', choice)
}

const startRound = room => {
  console.log('startRound');
  socket.emit('startRound', room)
}

const revealChoices = room => {
  console.log('revealChoices');
  socket.emit('revealChoices', room)
}

const startTurn = room => {
  console.log('startTurn')
  socket.emit('startTurn', room)
}

const gameReset = resetGame => {
  console.log('gameReset')
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
  startRound,
  revealChoices,
  startTurn
}