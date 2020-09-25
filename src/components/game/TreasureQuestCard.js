import React from 'react'

const TreasureQuestCard = ({ card, endCamp, endHazard }) => {

  return (
    <div className={`bg-green-500 font-bold p-2 ${endCamp || endHazard && 'font-light p-1 text-sm'}`}>
      TREASURE: { card.value }
    </div>
  )
}

export default TreasureQuestCard