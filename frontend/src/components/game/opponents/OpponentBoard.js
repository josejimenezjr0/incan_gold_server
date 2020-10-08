import React from 'react'
import OpponentChoice from './OpponentChoice'

const ZERO = 'zero'

const OpponentBoard = ({ player, questCycle }) => {
  return (
    <div className={`p-2 flex justify-center ${ player.choiceMade ? 'bg-blue-200' : 'bg-yellow-400' } mx-auto`}>
      { player.choice === null ?
        <div className={`mx-2 ${ player.choiceMade ? '' : 'bg-yellow-400 font-bold p-2' }`}>
          { questCycle === ZERO ? '' :
          player.choiceMade ? 'Decided!' : 'thinking' }
        </div>
        :
        <OpponentChoice choice={ player.choice }/>}
    </div>
  )
}

export default OpponentBoard