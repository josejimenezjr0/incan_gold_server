/**
 * Creates deck with first artifact already added and shuffles deck
 */
const createGame = () => {
  const hazards = [...Array(15)].map((_, index) => ({ card: 'HazardQuestCard', type: Math.ceil((index + 1) / 3), removed: false }))
  const values = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17]
  const treasures = values.map(value => ({ card: 'TreasureQuestCard', value }))
  const deck = [{ card: 'ArtifactQuestCard', value: null }, ...hazards, ...treasures].sort(() => Math.random() - .5)
  return [deck, [deck[0]]]
}

/**
 * Returns a new player and optionally an array of new player and new game
 */
const makePlayer_Game = (startInfo, uuid, room, socket) => {
  const { name, join } = startInfo
  let gameUpdate

  if(!join) {
    const { size } = startInfo
    const [deck, quest] = createGame()
    gameUpdate = { 
      room,
      size,
      deck,
      board: { round: 1, quest },
      players: [{ 
        name,
        uuid, 
        online: true,
        roundScore: 0,
        artifacts: [],
        choiceMade: false,
        choice: null 
      }]
    }
  } else {
    gameUpdate = {
        name,
        uuid, 
        online: true,
        roundScore: 0,
        artifacts: [],
        choiceMade: false,
        choice: null 
    }
  }

  const player = { 
    name,
    room,
    socket,
    host: true,
    totalScore: 0,
    roundScore: 0,
    artifacts: [],
    choiceMade: false,
    choice: null 
  }

  return [player, gameUpdate]
}

module.exports = {
  makePlayer_Game
}