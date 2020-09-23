import React from 'react'
import OpponentBoard from './OpponentBoard'
import Round from '../player/Round'

const OpponentsList = ({ player }) => {
  return (
    <div className={`text-center p-2 ${ player.online ? '' : 'bg-red-600'}`}>
      <div className={`py-1 px-2 ${ player.choiceMade ? 'bg-green-400 font-bold' : 'bg-yellow-400'}`}>
        { player.name }
      </div>
      <div className="flex flex-col justify-center">
        <OpponentBoard player={ player }/>
      { player.online ? <Round score={ player.roundScore } artifacts={ player.playerArtifacts}/> : <div className="text-xl transform rotate-90">:(</div> }
    </div>
    </div>
  )
}

export default OpponentsList