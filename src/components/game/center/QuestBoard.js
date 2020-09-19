import React from 'react'
import QuestCard from './QuestCard'
import HazardQuestCard from './HazardQuestCard'
import TreasureQuestCard from '../TreasureQuestCard'
import ArtifactQuestCard from '../ArtifactQuestCard'

const components = {
  HazardQuestCard,
  TreasureQuestCard,
  ArtifactQuestCard
}

const QuestBoard = ({ quest }) => {
  const cards = quest.map((card, index) => {
    let Component = components[card.card]
    return(
      <QuestCard key={ index }>
        <p>{ index + 1 }</p>
        <Component />
      </QuestCard>
    )
  })
  return (
    <div className="p-2 flex flex-wrap bg-red-300 items-center justify-center mx-auto text-center">
      { cards }
    </div>
  )
}

export default QuestBoard