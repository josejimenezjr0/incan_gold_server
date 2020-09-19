import React from 'react'
import ArtifactQuestCard from '../ArtifactQuestCard'

const Artifacts = ({ artifacts }) => {
  return (
    <div className="bg-red-500 font-bold p-2">
      { artifacts.map(({ value }, index) => <ArtifactQuestCard key={index} value={ value }/>) }
    </div>
  )
}

export default Artifacts