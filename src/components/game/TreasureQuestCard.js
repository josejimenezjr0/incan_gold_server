import React from 'react'

const TreasureQuestCard = ({ card }) => {

  return (
    <div className="bg-green-500 font-bold p-2">
      TREASURE: { card.value }
    </div>
  )
}

export default TreasureQuestCard