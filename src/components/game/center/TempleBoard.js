import React from 'react'
import TempleCard from './TempleCard'
import Tent from '../player/Tent'

const TempleBoard = ({ round, roundStart, spare, questCycle }) => {

  return (
    <div className="flex flex-col justify-center bg-orange-200 p-2">
      <div className="flex-col bg-purple-200">
        <div className="flex justify-center">
          <TempleCard position={ 5 } round={ round } roundStart={ roundStart } questCycle={ questCycle }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 3 } round={ round } roundStart={ roundStart } questCycle={ questCycle }/>
          <TempleCard position={ 4 } round={ round } roundStart={ roundStart } questCycle={ questCycle }/>
        </div>
        <div className="flex justify-center">
          <TempleCard position={ 1 } round={ round } roundStart={ roundStart } questCycle={ questCycle }/>
          <TempleCard position={ 2 } round={ round } roundStart={ roundStart } questCycle={ questCycle }/>
        </div>
      </div>
      <div>
        <Tent score={ spare } isSpare={ true }/>
      </div>
    </div>
  )
}

export default TempleBoard