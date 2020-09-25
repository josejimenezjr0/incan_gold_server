import React from 'react'

const HazardQuestCard = ({ card, endCamp, endHazard }) => {
  return (
    <div className={`bg-red-500 font-bold p-2 ${endCamp && 'font-light p-1 text-sm'} ${endHazard && 'p-4 text-xl'}`}>
      HAZARD: { card.type }
    </div>
  )
}

export default HazardQuestCard