import React from 'react'
import TorchCard from './TorchCard'
import CampCard from './CampCard'

const ZERO = 'zero'
const FLIP = 'flip'
const WAIT = 'wait'
const REVEAL = 'reveal'

const ChoiceBoard = ({ player, playerChoice, leftRound, questCycle, onePlayer }) => {
  const active = !leftRound && ((questCycle === WAIT || questCycle === REVEAL) || (questCycle === FLIP && onePlayer))

  return (
    <div className={`${ active ? '' : 'hidden'} p-2 mt-2 flex justify-center ${ player.choiceMade ? 'bg-blue-200' : 'bg-red-600 p-4' } mx-auto`}>
      <div>
        <TorchCard choice={ player.choice } choiceMade={ player.choiceMade } playerChoice={ playerChoice } onePlayer={ onePlayer }/>
        <CampCard choice={ player.choice } choiceMade={ player.choiceMade } playerChoice={ playerChoice } onePlayer={ onePlayer }/>
      </div>
    </div>
  )
}

export default ChoiceBoard