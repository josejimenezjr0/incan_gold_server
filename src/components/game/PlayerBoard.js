import React from 'react'
import TorchCard from './TorchCard'
import CampCard from './CampCard'

const PlayerBoard = () => {
  return (
    <div className="p-2 flex justify-center bg-purple-300 mx-auto">
      <TorchCard />
      <CampCard />
    </div>
  )
}

export default PlayerBoard