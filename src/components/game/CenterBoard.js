import React from 'react'
import TempleBoard from './TempleBoard'
import QuestBoard from './QuestBoard'

const CenterBoard = () => {
  return (
    <div className="p-2 flex bg-black justify-center">
      <div className="flex-col">
        <TempleBoard />
        <QuestBoard />
      </div>
    </div>
  )
}

export default CenterBoard