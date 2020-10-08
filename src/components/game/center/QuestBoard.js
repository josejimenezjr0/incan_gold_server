import React from 'react'
import QuestCard from './QuestCard'
import HazardQuestCard from './HazardQuestCard'
import TreasureQuestCard from '../TreasureQuestCard'
import ArtifactQuestCard from '../ArtifactQuestCard'
import TopQuestCard from './TopQuestCard'
import Tent from '../player/Tent'

const components = {
  HazardQuestCard,
  TreasureQuestCard,
  ArtifactQuestCard
}

const QuestBoard = ({ quest, questCycle, choicesReveal, turnStart, endCamp, endHazard, onePlayer, choice, leftRound, spare }) => {
  const cards = quest.map((card, index) => {
    const Component = components[card.card]

    return(
      <QuestCard key={ index } questCycle={ questCycle } onePlayer={ onePlayer } >
        <Component card={ card } endCamp={ endCamp } endHazard={ endHazard } questCycle={ questCycle }/>
      </QuestCard>
    )
  })
  return (
    <div className={ `flex flex-col items-center w-full text-center pt-4` }>
      <div>
        <QuestCard questCycle={ questCycle } onePlayer={ onePlayer }>
          <TopQuestCard choicesReveal={ choicesReveal } questCycle={ questCycle } turnStart={ turnStart } onePlayer={ onePlayer } choice={ choice } leftRound={ leftRound }/>
        </QuestCard>
        <div className="flex justify-center items-center">
          <Tent score={ spare } isSpare={ true }/>
        </div>
      </div>
      <div className="flex flex-col items-center w-full overflow-y-auto">
        { cards.reverse() }
      </div>
    </div>
  )
}

export default QuestBoard