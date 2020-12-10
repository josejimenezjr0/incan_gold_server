import io from 'socket.io-client'
let socket

const playerInit = (game, uuid) => {
  console.log('player init game: ', game);
  if(game.init) {
    console.log('if(game.init)');
    socket = io('http://localhost:4001', {
      transports: ['websocket']
    })
    socket.emit('create', game)
  } else {
    console.log(`reconnect from playerInit with uuid: ${uuid}`);
    socket = io(`http://localhost:4001?reconnect=${uuid}`, {
      transports: ['websockets']
    })
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

const choiceToggle = choiceData => {
  console.log(`choiceToggle - choiceData:`, choiceData)
  socket.emit('toggleChoice', choiceData)
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
  socket.on('forceReset', () => {
    console.log('gameReset')
    resetGame()
  })
}

const disconnect = () => {
  console.log('disconnect');
  socket.disconnect()
}

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
  startTurn,
  choiceToggle
}