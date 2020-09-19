import React from 'react'
import TorchCard from './TorchCard'
import CampCard from './CampCard'

const ChoiceBoard = ({ player, playerChoice }) => {
  return (
    <div className={`p-2 flex justify-center ${ player.choiceMade ? 'bg-blue-200' : playerChoice === 'opponent' ? 'bg-yellow-400' : 'bg-red-600' } mx-auto`}>
      {
        playerChoice === 'opponent' ? 
        <div className={`mx-2 ${ player.choiceMade ? 'hidden' : 'bg-yellow-400 font-bold p-2' }`}>
          thinking
        </div>
        :
        <div>
          <TorchCard choice={ player.choice } choiceMade={ player.choiceMade } playerChoice={ playerChoice }/>
          <CampCard choice={ player.choice } choiceMade={ player.choiceMade } playerChoice={ playerChoice }/>
        </div>
      
      }
    </div>
  )
}

export default ChoiceBoard