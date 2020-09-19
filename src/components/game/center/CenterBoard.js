import React from 'react'
import TempleBoard from './TempleBoard'
import QuestBoard from './QuestBoard'

const CenterBoard = ({ board }) => {
  return (
    <div className="p-2 flex bg-black justify-center">
      <div className="flex-col">
        <TempleBoard round={ board.round }/>
        <QuestBoard quest={ board.quest }/>
      </div>
    </div>
  )
}

export default CenterBoard