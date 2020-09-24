const A_CARD = 'ArtifactQuestCard'
const T_CARD = 'TreasureQuestCard'
const H_CARD = 'HazardQuestCard'

/**
 * Creates deck with first artifact already added and shuffles deck
 */
const createGame = () => {
  const hazards = [...Array(15)].map((_, index) => ({ card: H_CARD, type: Math.ceil((index + 1) / 3) - 1 }))
  const values = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17]
  const treasures = values.map(value => ({ card: T_CARD, value }))
  const deck = [...hazards, ...treasures]
  return deck
}

/**
 * Returns a new player and optionally an array of new player and new game
 */
const makePlayer_Game = (startInfo, uuid, room, socket, game) => {
  const { name, join } = startInfo
  let gameUpdate
  const player = {
    uuid,
    socketID: socket,
    name,
    host: true, 
    online: true,
    roundScore: 0,
    totalScore: 0,
    playerArtifacts: [],
    leftRound: false,
    showChoice: true,
    choiceMade: true,
    choice: true,
    timer: null 
  }

  if(!join) {
    const { size } = startInfo
    const deck = createGame()
    gameUpdate = { 
      room,
      size,
      deck,
      round: 0,
      turn: 0,
      endRound: false,
      quest: [],
      spare: 0,
      hazards: [0,0,0,0,0],
      artifacts: 0,
      reveal: false,
      players: [player]
    }
  } else gameUpdate = { ...game, players: [...game.players, player] }

  return gameUpdate
}

const hideInfo = (game) => {
  const hidePlayers = game.players.map(player => { 
    return player.showChoice ? { ...player, totalScore: null } : { ...player, totalScore: null, choice: null }
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
    leftRound: player.leftRound,
    showChoice: player.showChoice,
    choiceMade: player.choiceMade,
    choice: player.choice
  }
}

const revealChoices = players => {
  const stayed = players.filter(player => player.choice).map(player => { return { ...player, showChoice: true } })
  const left = players.filter(player => !player.choice)

  return [...stayed, ...left]
}

const calcTentScore = (players, quest, spare) => {
  const campCount = players.length
  const artifactsScore = campCount !== 1 ? 0 : quest.reduce((acc, card) => card.card === A_CARD ? acc + card.value : acc)
  const score = Math.floor(spare / campCount) + artifactsScore
  const treasureSpare =  spare % campCount

  const playersUpdate = players.map(player => { return { ...player, roundScore: 0, totalScore: player.totalScore + player.roundScore + score } })

  return { campPlayers: playersUpdate, campSpare: spare + treasureSpare, campQuest: quest.filter(card => card.card !== A_CARD) }
}

const calcScores = (players, card, spare, quest) => {
  const score = Math.floor( card.value / players.length)
  const treasureSpare =  card.value % players.length

  const playersUpdate = players.map(player => { return { ...player, roundScore: player.roundScore + score } })

  return { torchPlayers: playersUpdate, spare: spare + treasureSpare, quest: [card, ...quest] }
}

const checkHazards = (card, hazards, quest) => {
  const hazardsUpdate = hazards.map((count, index) => card.type === index + 1 ? count + 1 : count)
  const endRound = hazardsUpdate.some(hazard => hazard > 1)

  return { endRound, hazards: hazardsUpdate, quest: endRound ? quest : [...card, ...quest] }
}

const checkTopCard = (topCard, players, spare, hazards, quest, artifacts) => {
  const scoreUpdate = topCard.card === T_CARD ? calcScores(players, topCard, spare, quest) : {}
  const hazardsUpdate = topCard.card === H_CARD ? checkHazards(topCard, hazards, quest) : {}
  const artifactUpdate = topCard.card === A_CARD ? { quest: [{...topCard, value: artifacts > 3 ? 10 : 5 }, ...quest] } : {}

  return { torchPlayers: [], ...scoreUpdate, ...hazardsUpdate, ...artifactUpdate }
}

const startTurn = game => {
  const tentPlayers = game.players.filter(player => player.leftRound)
  const torch = game.players.filter(player => player.choice)
  const camp = game.players.filter(player => !player.choice)

  const { campPlayers, campSpare, campQuest } = calcTentScore(camp, game.quest, game.spare)
  const { torchPlayers, spare, quest, endRound, hazards } = checkTopCard(game.deck[0], torch, campSpare, game.hazards, campQuest, game.artifacts)
  const playersUpdate = [...campPlayers, ...torchPlayers, ...tentPlayers]
  const deckUpdate = [...game.deck.filter((_, index) => index !== 0)]

  return { ...game, players: playersUpdate, deck: deckUpdate, spare, quest, endRound, hazards }
}

const startRound = game => {
  const deckUpdate = [...game.deck, ...game.quest, { card: A_CARD, value: null }].sort(() => Math.random() - .5)
  const playersUpdate = game.players.map(player => { return { ...player, roundScore: 0, showChoice: true, choiceMade: true, choice: true } })
  return { ...game, players: playersUpdate, round: game.round + 1, endRound: false, deck: deckUpdate, spare: 0, hazards: [0,0,0,0,0] }
}

module.exports = {
  makePlayer_Game,
  hideInfo,
  playerInfo,
  startTurn,
  startRound,
  calcScores,
  revealChoices
}