import React from 'react'
import TempleCard from './TempleCard'

const TempleBoard = ({ round, roundStart }) => {

  return (
    <div className="flex justify-center bg-orange-200 p-2">
      <div className="flex-col bg-purple-200">
        <div className="flex justify-center">
          <TempleCard position={ 5 } round={ round } roundStart={ roundStart }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 3 } round={ round } roundStart={ roundStart }/>
          <TempleCard position={ 4 } round={ round } roundStart={ roundStart }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 1 } round={ round } roundStart={ roundStart }/>
          <TempleCard position={ 2 } round={ round } roundStart={ roundStart }/>
        </div>
      </div>
    </div>
  )
}

export default TempleBoard