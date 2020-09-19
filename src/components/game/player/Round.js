import React from 'react'
import Artifacts from './Artifacts'

const Round = ({ score, artifacts }) => {
  return (
    <div className="bg-orange-500 font-bold p-2 text-center">
    <p>Round</p>
    <p>{ score }</p>
    <Artifacts artifacts={ artifacts } />
    </div>
  )
}

export default Round