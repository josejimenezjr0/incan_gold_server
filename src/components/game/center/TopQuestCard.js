import React from 'react'

const ZERO = 'zero'
const WAIT = 'wait'
const REVEAL = 'reveal'
const FLIP = 'flip'

const TopQuestCard = ({ turnStart, choicesReveal, questCycle }) => {
  const hide = <div ></div>
  const waiting = <div className="bg-red-800 text-white font-bold p-2"> Waiting...</div>
  const choices = <button type="button" className="bg-red-800 text-white font-bold p-2" onClick={ choicesReveal }>REVEAL!</button>
  const flipQuest = <button type="button" className="bg-red-800 text-white font-bold p-2" onClick={ turnStart }>?QUEST?</button>

  const cycle = {
    [ZERO]: hide,
    [WAIT]: waiting,
    [REVEAL]: choices,
    [FLIP]: flipQuest,
  }

  return (
    <div className={`${questCycle === ZERO && 'hidden'}`}>
      { cycle[questCycle] }
    </div>
    
  )
}

export default TopQuestCard