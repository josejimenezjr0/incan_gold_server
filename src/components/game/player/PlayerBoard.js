import React from 'react'
import TorchCard from './TorchCard'
import CampCard from './CampCard'
import Round from './Round'
import Tent from './Tent'
import ChoiceBoard from './ChoiceBoard'

const PlayerBoard = ({ player, playerChoice }) => {
  return (
    <div className="flex flex-col bg-green-200 p-2">
      <ChoiceBoard player={ player } playerChoice={ playerChoice }/>
      <div className="p-2 flex justify-center bg-purple-300 mx-auto">
        <div className="flex">
          <Tent score={ player.totalScore }/>
          <Round score={ player.roundScore } artifacts={ player.artifacts}/> 
        </div>
      </div>
    </div>
  )
}

export default PlayerBoard