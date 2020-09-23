import React from 'react'

const OpponentChoice = ({ choice }) => {
  return (
    <div className={`mx-2 border-4 border-yellow-600 ${ choice ? 'bg-teal-500' : 'bg-purple-500' } font-bold p-2`}>
      { choice ? 'TORCH' : 'CAMP' }
    </div>)
}

export default OpponentChoice