import React from 'react'

const TorchCard = ({ choice, choiceMade, playerChoice, toggleChoice }) => {
  return (
    <button type="button" name="torch" onClick={ toggleChoice } className={`${ choice === 'Torch' ? 'bg-teal-200' : 'bg-purple-200' } ${ choiceMade ? 'border-2 border-green-300' : 'border-2 border-gray-600' } text-gray-900 tracking-wide font-bold py-1 mr-1 w-16 rounded focus:outline-none`}>
      { choice === 'Torch' ? 'Torch' : 'Camp'}
    </button>)
}

export default TorchCard