import React from 'react'

const ZERO = 'zero'
const WAIT = 'wait'
const REVEAL = 'reveal'
const FLIP = 'flip'
const CAMP = 'camp'
const HAZARD = 'hazard'

const TopQuestCard = ({ turnStart, choicesReveal, questCycle, onePlayer, choice, leftRound }) => {
  const zero = <div className="bg-yellow-400 p-1"> Get Ready!</div>
  const waiting = <div className="bg-yellow-400 p-1"> Waiting...</div>
  const choices = <button type="button" className="bg-blue-800 text-white font-bold p-2" onClick={ choicesReveal }>REVEAL!</button>
  const flipQuest = <button type="button" className="bg-orange-500 font-bold p-2" onClick={ onePlayer && !choice ? choicesReveal : turnStart }>{`${onePlayer && !choice ? 'Leave?' : '?QUEST?'}`}</button>
  const camp = <div className="bg-yellow-400 font-bold p-2">All Camp</div>
  const hazard = <div className="bg-red-800 text-white font-bold p-2">HAZARDS!!!</div>

  const left = leftRound && (questCycle !== CAMP && questCycle !== HAZARD)

  const cycle = {
    [ZERO]: zero,
    [WAIT]: waiting,
    [REVEAL]: choices,
    [FLIP]: flipQuest,
    [CAMP]: camp,
    [HAZARD]: hazard
  }

  return (
    <div>
      { left ?
      <div className="bg-yellow-400 font-bold p-2">Left to camp!</div>
      :
      cycle[questCycle] }
    </div>
    
  )
}

export default TopQuestCard