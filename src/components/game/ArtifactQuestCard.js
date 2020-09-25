import React from 'react'

const ArtifactQuestCard = ({ value, endCamp, endHazard }) => {
  return (
    <div className={`bg-pink-500 font-bold m-2 p-2 ${endCamp || endHazard && 'font-light p-1 text-sm'}`}>
      <p>ARTIFACT</p>
      <p>{ value }</p>
    </div>
  )
}

export default ArtifactQuestCard