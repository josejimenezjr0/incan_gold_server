import React from 'react'

const HazardQuestCard = ({ card }) => {
  return (
    <div className="bg-red-500 font-bold p-2">
      HAZARD: { card.type }
    </div>
  )
}

export default HazardQuestCard