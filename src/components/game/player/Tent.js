import React from 'react'
import TreasurePiece from '../TreasurePiece'
import TurquoiseTreasurePiece from '../TurquoiseTreasurePiece'
import ObsidianTreasurePiece from '../ObsidianTreasurePiece'
import GoldTreasurePiece from '../GoldTreasurePiece'

const components = [
  GoldTreasurePiece,
  ObsidianTreasurePiece,
  TurquoiseTreasurePiece
]

const calcPieces = score => {
  let gold = 0,
    obsidian = 0,
    turquoise = 0

  if(score === 0) return []

  gold = Math.floor(score / 10)
  turquoise = score % 10
  if (turquoise  !== 0) {
    turquoise -= 5
    if (turquoise >=0) {
      obsidian++
    }
    else turquoise += 5
  }
  return [ gold, obsidian, turquoise ]
}

const Tent = ({ score, isSpare }) => {
  const scorePieces = calcPieces(score)
    .map((piece, treasureIndex) => {
      if(piece) {
        const Component = components[treasureIndex]
        return(
          <div className="flex justify-center">
            {[...Array(piece)].map((_, index) => (
              <TreasurePiece key={`${treasureIndex} - ${index}`}>
                <Component />
              </TreasurePiece>
            ))}
          </div>
        )
      }
  })

  return (
    <div className="bg-blue-500 font-bold p-2 text-center">
    <p>{isSpare ? 'Spare' : 'Tent'}</p>
    <p>{ score }</p>
    { scorePieces }
    </div>
  )
}

export default Tent