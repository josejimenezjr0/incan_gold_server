import React from 'react'
import TempleCard from './TempleCard'

const TempleBoard = ({ round, roundStart, questCycle, sizeWait }) => {

  return (
    <div className="flex flex-col justify-center mx-auto">
      <div className="flex-col p-1">
        <div className="flex justify-center items-center">
          <TempleCard position={ 5 } round={ round } roundStart={ roundStart } questCycle={ questCycle } sizeWait={ sizeWait }/>
        </div>
        <div className="flex justify-center items-center">
          <TempleCard position={ 3 } round={ round } roundStart={ roundStart } questCycle={ questCycle } sizeWait={ sizeWait }/>
          <TempleCard position={ 4 } round={ round } roundStart={ roundStart } questCycle={ questCycle } sizeWait={ sizeWait }/>
        </div>
        <div className="flex justify-center items-center">
          <TempleCard position={ 1 } round={ round } roundStart={ roundStart } questCycle={ questCycle } sizeWait={ sizeWait }/>
          <TempleCard position={ 2 } round={ round } roundStart={ roundStart } questCycle={ questCycle } sizeWait={ sizeWait }/>
        </div>
      </div>
    </div>
  )
}

export default TempleBoard