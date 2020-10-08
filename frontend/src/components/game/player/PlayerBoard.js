import React from 'react'
import Round from './Round'
import Tent from './Tent'
import ChoiceBoard from './ChoiceBoard'
import Artifacts from './Artifacts'

const PlayerBoard = ({ player, playerChoice, toggleChoice, questCycle, onePlayer }) => {
  return (
    <div className="flex flex-col w-1/2 justify-between bg-blue-100 rounded-lg py-1 mt-2">
      <div className="flex justify-center w-full h-full pt-4">
        <div className="flex flex-col w-full px-2 mt-1">
          <div className="bg-gray-200 rounded-lg mx-auto p-1 mb-6 h-20 w-20">
            <Round score={ player.roundScore }/> 
          </div>
          <div className="bg-purple-200 rounded-lg mx-auto p-1 mb-6 h-20 w-20">
            <Artifacts artifacts={ player.playerArtifacts} />
          </div>
          <div className="bg-green-200 rounded-lg mx-auto p-1 mb-6 h-20 w-20">
            <Tent score={ player.totalScore }/>
          </div>
        </div>
      </div>
      <ChoiceBoard player={ player } playerChoice={ playerChoice } toggleChoice={ toggleChoice } leftRound={ player.leftRound } questCycle={ questCycle } onePlayer={ onePlayer }/>
    </div>
  )
}

export default PlayerBoard