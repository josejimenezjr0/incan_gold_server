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

const QuestBoard = ({ quest, questCycle, choicesReveal, turnStart, endCamp, endHazard, onePlayer, choice, leftRound }) => {
  const cards = quest.map((card, index) => {
    const Component = components[card.card]

    return(
      <QuestCard key={ index } questCycle={ questCycle } onePlayer={ onePlayer } >
        <Component card={ card } endCamp={ endCamp } endHazard={ endHazard } questCycle={ questCycle }/>
      </QuestCard>
    )
  })
  return (
    <div className={ `p-2 flex flex-wrap items-center justify-center mx-auto text-center` }>
      { cards.reverse() }
      <QuestCard questCycle={ questCycle } onePlayer={ onePlayer }>
        <TopQuestCard choicesReveal={ choicesReveal } questCycle={ questCycle } turnStart={ turnStart } onePlayer={ onePlayer } choice={ choice } leftRound={ leftRound }/>
      </QuestCard>
    </div>
  )
}

export default QuestBoard