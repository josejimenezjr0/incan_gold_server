import React from 'react'

const CampCard = ({ choice, choiceMade, playerChoice }) => {
  return (
    <button type="button" name="camp" onClick={ e => playerChoice(e) } className={`focus:outline-none inline-block mx-2 ${ !choiceMade ? 'bg-purple-200 p-1 text-xs' : choice ? 'bg-purple-200 p-1 text-xs' : 'border-4 border-yellow-300 bg-purple-500 font-bold p-2' }`}>
      CAMP
    </button>)
}

export default CampCard