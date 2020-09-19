import React from 'react'

const TempleCard = ({ position, flipped }) => {
  return (
    flipped ?
    <div className="bg-orange-500 font-bold p-2 m-1">
      {`TEMPLE ${ position }`}
    </div>
    :
    <div className="bg-gray-800 text-white text-xs p-2 m-1">
      {`TEMPLE ${ position }`}
    </div>
  )
}

export default TempleCard