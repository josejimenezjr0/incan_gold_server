import React from 'react'

const TorchCard = ({ choice, choiceMade, playerChoice }) => {
  return (
    <button type="button" name="torch" onClick={ e => playerChoice(e) } className={`focus:outline-none inline-block mx-2 ${ !choiceMade ? 'bg-teal-200 p-1 text-xs' : choice ? 'border-4 border-yellow-600 bg-teal-500 font-bold p-2' : 'bg-teal-200 p-1 text-xs' }`}>
      TORCH
    </button>)
}

export default TorchCard