import React from 'react'
import TempleCard from './TempleCard'

let flipped = Array(5).fill(false)

const TempleBoard = ({ round }) => {
  flipped = flipped.map((_, index) => (index + 1) <= round)

  return (
    <div className="flex justify-center bg-orange-200 p-2">
      <div className="flex-col bg-purple-200">
        <div className="flex justify-center">
          <TempleCard position={ 5 } flipped={ flipped[4] }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 3 } flipped={ flipped[2] }/>
          <TempleCard position={ 4 } flipped={ flipped[3] }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 1 } flipped={ flipped[0] }/>
          <TempleCard position={ 2 } flipped={ flipped[1] }/>
        </div>
      </div>
    </div>
  )
}

export default TempleBoard