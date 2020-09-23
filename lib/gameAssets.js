/**
 * Creates deck with first artifact already added and shuffles deck
 */
const createGame = () => {
  const hazards = [...Array(15)].map((_, index) => ({ card: 'HazardQuestCard', type: Math.ceil((index + 1) / 3) - 1, removed: false }))
  const values = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17]
  const treasures = values.map(value => ({ card: 'TreasureQuestCard', value }))
  const deck = [...hazards, ...treasures]
  return deck
}

/**
 * Returns a new player and optionally an array of new player and new game
 */
const makePlayer_Game = (startInfo, uuid, room, socket, game) => {
  const { name, join } = startInfo
  let gameUpdate

  if(!join) {
    const { size } = startInfo
    const deck = createGame()
    gameUpdate = { 
      room,
      size,
      deck,
      round: 0,
      quest: [],
      hazards: [0,0,0,0,0],
      artifacts: [],
      players: [{
        uuid,
        socketID: socket,
        name,
        host: true, 
        online: true,
        roundScore: 0,
        totalScore: 0,
        playerArtifacts: [],
        choiceMade: true,
        choice: true,
        timer: null 
      }]
    }
  } else {
    gameUpdate = { 
      ...game,
      players: [
        ...game.players,
        {
          uuid,
          socketID: socket,
          online: true,
          timer: null, 
          name,
          host: true, 
          totalScore: 0,
          roundScore: 0,
          playerArtifacts: [],
          choiceMade: true,
          choice: true,
        }
      ]
    }
  }

  return gameUpdate
}

const hideInfo = (game, choiceReveal) => {
  const hidePlayers = game.players.map(player => { 
    return choiceReveal ? { ...player, totalScore: null } : { ...player, totalScore: null, choice: null }
  })
  return { ...game, deck: null, players: hidePlayers }
}

const playerInfo = (game, uuid) => {
  const [player] = game.players.filter(player => player.uuid == uuid)
  return {
    name: player.name,
    host: player.host,
    totalScore: player.totalScore,
    roundScore: player.roundScore,
    playerArtifacts: player.playerArtifacts,
    choiceMade: player.choiceMade,
    choice: player.choice
  }
}

const startRound = game => {
  const deckUpdate = [...game.deck, { card: 'ArtifactQuestCard', value: null }].sort(() => Math.random() - .5)
  const gameUpdate = { ...game, round: game.round + 1, deck: deckUpdate }
  return gameUpdate
}


const intoTemple = (room) => {
  game = games[room]
  if(game.deck[0].card === 'TreasureQuestCard') {
    game.board.quest = [...game.board.quest, game.deck[0]]
    calcScores(game.deck[0].value, room)
    return
  }

  if(game.deck[0].card === 'ArtifactQuestCard') {
    game.deck[0].value = game.board.artifacts.length > 3 ? 10 : 5
    game.board.artifacts = [...game.board.artifacts, game.deck[0]]
  } else game.board.hazards[type]++

  game.board.quest = [...game.board.quest, game.deck[0]]
}

const calcScores = (value, room) => {
  const stayed = Object.entries(games[room].players).filter(([_, info]) => info.choice)
  const score = Math.floor(value / stayed.length)
  game.board.quest[game.board.quest.length - 1].value = value % stayed.length

  stayed.map(([uuid, _]) => games[room].players[uuid].roundScore+= score)
}

const endRound = (room) => {

}

module.exports = {
  makePlayer_Game,
  hideInfo,
  playerInfo,
  startRound,
  intoTemple,
  calcScores,
  endRound

}