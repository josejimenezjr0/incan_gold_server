import React from 'react'

const ZERO = 'zero'
const CAMP = 'camp'
const HAZARD = 'hazard'



const TempleCard = ({ position, round, roundStart, questCycle }) => {
  const flipped = round >= position
  const nextRound = round + 1 === position  
  const activate = nextRound && (questCycle === ZERO || questCycle === CAMP || questCycle === HAZARD)

  return (
    flipped ?
    <div className="bg-orange-500 font-bold p-2 m-2">
      {`TEMPLE ${ position }`}
    </div>
    :
    <button type="button" disabled={ !activate } className={`${ activate ? 'border-4 border-yellow-300 bg-gray-800 text-white font-bold p-4 m-2' : 'bg-gray-800 text-white text-xs p-1 m-1 opacity-50 cursor-not-allowed'}`} onClick={ roundStart }>
      {`TEMPLE ${ position }`}
    </button>
  )
}

export default TempleCard