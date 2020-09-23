import React from 'react'

const TempleCard = ({ position, round, roundStart }) => {
  const flipped = round === position
  const nextRound = round + 1 === position  
  return (
    flipped ?
    <div className="bg-orange-500 font-bold p-2 m-1">
      {`TEMPLE ${ position }`}
    </div>
    :
    <button type="button" disabled={ !nextRound } className={`bg-gray-800 text-white text-xs p-2 m-1 ${ nextRound ? '' : 'opacity-75 cursor-not-allowed'}`} onClick={ roundStart }>
      {`TEMPLE ${ position }`}
    </button>
  )
}

export default TempleCard