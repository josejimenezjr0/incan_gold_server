import React from 'react'

const OpponentChoice = ({ choice }) => {
  return (
    <div className={`mx-2 font-bold text-xl p-4 border-4 border-yellow-300 ${ choice ? 'bg-teal-500' : 'bg-purple-500' }`}>
      { choice ? 'TORCH' : 'CAMP' }
    </div>)
}

export default OpponentChoice