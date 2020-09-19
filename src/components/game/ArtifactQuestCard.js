import React from 'react'

const ArtifactQuestCard = ({ value }) => {
  return (
    <div className="bg-pink-500 font-bold m-2 p-2">
      <p>ARTIFACT</p>
      <p>{ value }</p>
    </div>
  )
}

export default ArtifactQuestCard