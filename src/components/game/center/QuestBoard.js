import React from 'react'
import QuestCard from './QuestCard'
import HazardQuestCard from './HazardQuestCard'
import TreasureQuestCard from '../TreasureQuestCard'
import ArtifactQuestCard from '../ArtifactQuestCard'
import TopQuestCard from './TopQuestCard'

const components = {
  HazardQuestCard,
  TreasureQuestCard,
  ArtifactQuestCard
}

const QuestBoard = ({ quest, questCycle, choicesReveal, turnStart, endCamp, endHazard }) => {
  const cards = quest.map((card, index) => {
    const Component = components[card.card]

    return(
      <QuestCard key={ index } >
        <Component card={ card } endCamp={ endCamp } endHazard={ endHazard }/>
      </QuestCard>
    )
  })
  return (
    <div className={ `p-2 flex flex-wrap bg-red-300 items-center justify-center mx-auto text-center` }>
      { cards.reverse() }
      <QuestCard >
        <TopQuestCard choicesReveal={ choicesReveal } questCycle={ questCycle } turnStart={ turnStart }/>
      </QuestCard>
    </div>
  )
}

export default QuestBoard