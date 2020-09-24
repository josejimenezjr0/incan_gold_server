import React from 'react'

const TopQuestCard = ({ turnStart, choicesReveal }) => {
  const startAction = turnStart || choicesReveal
  return (
    <button type="button" className="bg-red-800 text-white font-bold p-2" onClick={ startAction }>
      ?QUEST?
    </button>
  )
}

export default TopQuestCard