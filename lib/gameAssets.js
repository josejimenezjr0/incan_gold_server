const A_CARD = 'ArtifactQuestCard'
const T_CARD = 'TreasureQuestCard'
const H_CARD = 'HazardQuestCard'
const ZERO = 'zero'
const WAIT = 'wait'
const REVEAL = 'reveal'
const FLIP = 'flip'

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
      questCycle: ZERO,
      endCamp: false,
      endHazard: false,
      quest: [],
      spare: 0,
      hazards: [0,0,0,0,0],
      artifacts: 0,
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
  const update = players.map(player => { return { ...player, showChoice: true } })
  return update
}

const concealChoices = players => {
  return players.map(player => { return { ...player, showChoice: false, choiceMade: false, choice: null } })
}

const calcTentScore = (players, quest, spare) => {
  console.log('spare: ', spare);
  const campCount = players.length
  console.log('campCount: ', campCount);
  if(campCount === 0) return { campPlayers: players, campSpare: spare, campQuest: quest }
  const artifactsScore = campCount !== 1 ? 0 : quest.reduce((acc, card) => card.card === A_CARD ? acc + card.value : acc, 0)
  console.log('artifactsScore: ', artifactsScore);
  const score = Math.floor(spare / campCount) + artifactsScore
  console.log('score: ', score);
  const treasureSpare = spare % campCount
  console.log('treasureSpare: ', treasureSpare);

  const playersUpdate = players.map(player => { return { ...player, leftRound:true, roundScore: 0, totalScore: player.totalScore + player.roundScore + score } })
  console.log('playersUpdate: ', playersUpdate);

  return { campPlayers: playersUpdate, campSpare: treasureSpare, campQuest: quest.filter(card => card.card !== A_CARD) }
}

const calcScores = (players, card, spare, quest) => {
  console.log('calcscore spare: ', spare);
  const score = Math.floor( card.value / players.length)
  const treasureSpare =  card.value % players.length
  console.log('calcscore treasureSpare: ', treasureSpare);

  const playersUpdate = players.map(player => { return { ...player, roundScore: player.roundScore + score } })

  return { players: playersUpdate, spare: spare + treasureSpare, quest: [card, ...quest] }
}

const checkHazards = (card, hazards, quest, questCycle) => {
  const hazardsUpdate = hazards.map((count, index) => card.type === index ? count + 1 : count)
  const endHazard = hazardsUpdate.some(hazard => hazard > 1)
  console.log('endHazard: ', endHazard);

  return { endHazard, hazards: hazardsUpdate, quest: [card, ...quest], questCycle: endHazard ? ZERO : questCycle }
}

const checkTopCard = (topCard, players, spare, hazards, quest, artifacts, questCycle) => {
  return {
    spare,
    ...(topCard.card === T_CARD && calcScores(players, topCard, spare, quest)),
    ...(topCard.card === H_CARD && checkHazards(topCard, hazards, quest, questCycle)),
    ...topCard.card === A_CARD && { quest: [{  ...topCard, value: artifacts > 3 ? 10 : 5 }, ...quest] } }
}

const startTurn = game => {
  const tentPlayers = game.players.filter(player => player.leftRound)
  const torch = game.players.filter(player => player.choice)
  const endCamp = torch.length === 0
  const camp = game.players.filter(player => !player.choice)

  const { campPlayers, campSpare, campQuest } = calcTentScore(camp, game.quest, game.spare)
  if(endCamp) return { ...game, endCamp, players: [...tentPlayers, ...campPlayers], questCycle: ZERO }

  const topCardUpdate = checkTopCard(game.deck[0], torch, campSpare, game.hazards, campQuest, game.artifacts, game.questCycle)
  console.log('topCardUpdate: ', topCardUpdate);
  const turnPlayers = [...(game.deck[0].card === T_CARD ? topCardUpdate.players : torch)]
  const turnConcealed = concealChoices(turnPlayers)
  const playersUpdate = [...tentPlayers, ...campPlayers, ...turnConcealed]
  const deckUpdate = [...game.deck.filter((_, index) => index !== 0)]

  return { ...game, questCycle: torch.length === 1 ? FLIP : WAIT, ...topCardUpdate, players: playersUpdate, deck: deckUpdate }
}

const startRound = (game) => {
  const questUpdate = game.endHazard ? [...game.quest.filter((_, index) => index !== 0)] : game.quest
  const deckUpdate = [...game.deck, ...questUpdate, { card: A_CARD, value: null }].sort(() => Math.random() - .5)
  const playersUpdate = game.players.map(player => { return { ...player, roundScore: 0, showChoice: true, choiceMade: true, choice: true } })
  return { ...game, players: playersUpdate, round: game.round + 1, questCycle: WAIT, endCamp: false, endHazard: false, deck: deckUpdate, spare: 0, hazards: [0,0,0,0,0] }
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