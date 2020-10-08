import React from 'react'
import QuestBoard from './QuestBoard'


const CenterBoard = ({ choicesReveal, turnStart, game, playerInfo }) => {
  const { quest, questCycle, endCamp, endHazard, onePlayer, spare } = game
  return (
    <div className="w-1/2 flex justify-center py-1 mt-2">
      <QuestBoard 
        quest={ quest } 
        questCycle={ questCycle } 
        choicesReveal={ choicesReveal } 
        turnStart={ turnStart } 
        endCamp={ endCamp } 
        endHazard={ endHazard } 
        onePlayer={ onePlayer } 
        choice={ playerInfo.choice } 
        leftRound={ playerInfo.leftRound }
        spare={ spare }/>
    </div>
  )
}

export default CenterBoard