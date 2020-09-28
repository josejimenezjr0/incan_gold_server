import React from 'react'
import TempleBoard from './TempleBoard'
import QuestBoard from './QuestBoard'

const CenterBoard = ({ round, quest, roundStart, questCycle, choicesReveal, turnStart, spare, endCamp, endHazard, onePlayer, playerInfo }) => {
  return (
    <div className="p-2 flex justify-center">
      <div className="flex-col">
        <TempleBoard round={ round } roundStart={ roundStart } spare={ spare } questCycle={ questCycle }/>
        <QuestBoard quest={ quest } questCycle={ questCycle } choicesReveal={ choicesReveal } turnStart={ turnStart } endCamp={ endCamp } endHazard={ endHazard } onePlayer={ onePlayer } choice={ playerInfo.choice } leftRound={ playerInfo.leftRound }/>
      </div>
    </div>
  )
}

export default CenterBoard