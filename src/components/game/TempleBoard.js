import React from 'react'
import TempleCard from './TempleCard'

const TempleBoard = () => {
  return (
    <div className="flex justify-center bg-orange-200 p-2">
      <div className="flex-col bg-purple-200">
        <div className="flex justify-center">
          <TempleCard />
        </div>
        <div className="flex justify-center">
          <TempleCard />
          <TempleCard />
        </div>
        <div className="flex justify-center">
          <TempleCard />
          <TempleCard />
        </div>
      </div>
    </div>
  )
}

export default TempleBoard