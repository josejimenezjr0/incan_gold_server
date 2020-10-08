import React from 'react'

const ZERO = 'zero'
const CAMP = 'camp'
const HAZARD = 'hazard'



const TempleCard = ({ position, round, roundStart, questCycle, sizeWait }) => {
  const flipped = round >= position
  const nextRound = round + 1 === position  
  const activate = (nextRound && sizeWait) && (questCycle === ZERO || questCycle === CAMP || questCycle === HAZARD)

  return (
    flipped ?
    <div className="border-2 border-yellow-300 bg-green-900 text-white text-sm p-1 font-semibold rounded">
      {`TEMPLE ${ position }`}
    </div>
    :
    <button type="button" disabled={ !activate } className={`${ activate ? 'animate-pulse' : 'opacity-50'} border-2 border-blue-100 bg-green-900 text-white text-sm p-1 font-semibold rounded`} onClick={ roundStart }>
      {`TEMPLE ${ position }`}
    </button>
  )
}

export default TempleCard