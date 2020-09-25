import React from 'react'

const ZERO = 'zero'

const TempleCard = ({ position, round, roundStart, questCycle }) => {
  const flipped = round === position
  const nextRound = round + 1 === position  
  return (
    flipped ?
    <div className="bg-orange-500 font-bold p-2 m-1">
      {`TEMPLE ${ position }`}
    </div>
    :
    <button type="button" disabled={ !nextRound || questCycle !== ZERO } className={`bg-gray-800 text-white text-xs p-2 m-1 ${ nextRound && questCycle === ZERO ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={ roundStart }>
      {`TEMPLE ${ position }`}
    </button>
  )
}

export default TempleCard