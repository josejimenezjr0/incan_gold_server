import React from 'react'
import Round from './Round'
import Tent from './Tent'
import ChoiceBoard from './ChoiceBoard'

const PlayerBoard = ({ player, playerChoice, questCycle, onePlayer }) => {
  return (
    <div className="flex flex-col p-2">
      <div className="text-center font-bold">{ player.name }</div>
      <ChoiceBoard player={ player } playerChoice={ playerChoice } leftRound={ player.leftRound } questCycle={ questCycle } onePlayer={ onePlayer }/>
      <div className="pt-4 flex justify-center mx-auto">
        <div className="flex">
          <div className="">
            <Tent score={ player.totalScore }/>
          </div>
          <div className="">
            <Round score={ player.roundScore } artifacts={ player.playerArtifacts}/> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerBoard