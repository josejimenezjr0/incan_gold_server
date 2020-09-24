import React from 'react'
import TempleBoard from './TempleBoard'
import QuestBoard from './QuestBoard'

const CenterBoard = ({ round, quest, roundStart, allChoices, choicesReveal, turnStart }) => {
  return (
    <div className="p-2 flex bg-black justify-center">
      <div className="flex-col">
        <TempleBoard round={ round } roundStart={ roundStart }/>
        <QuestBoard quest={ quest } allChoices={ allChoices } choicesReveal={ choicesReveal } turnStart={ turnStart }/>
      </div>
    </div>
  )
}

export default CenterBoard