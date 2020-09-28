import React from 'react'

const ArtifactQuestCard = ({ card, endCamp, endHazard }) => {
  console.log('card: ', card);
  // console.log('card.card: ', card.card);
  // console.log('card.value: ', card.value);
  return (
    <div className={`bg-pink-500 font-bold m-2 p-2 ${endCamp || endHazard && 'font-light p-1 text-sm'}`}>
      {/* ARTIFACT: { card.value } */}
      ARTIFACT
    </div>
  )
}

export default ArtifactQuestCard