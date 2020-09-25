import React from 'react'
import Round from './Round'
import Tent from './Tent'
import ChoiceBoard from './ChoiceBoard'

const PlayerBoard = ({ player, playerChoice, questCycle }) => {
  return (
    <div className="flex flex-col bg-green-200 p-2">
      <div className="text-center font-bold">{ player.name }</div>
      <ChoiceBoard player={ player } playerChoice={ playerChoice } leftRound={ player.leftRound } questCycle={ questCycle }/>
      <div className="p-2 flex justify-center bg-purple-300 mx-auto">
        <div className="flex">
          <Tent score={ player.totalScore }/>
          <Round score={ player.roundScore } artifacts={ player.playerArtifacts}/> 
        </div>
      </div>
    </div>
  )
}

export default PlayerBoard