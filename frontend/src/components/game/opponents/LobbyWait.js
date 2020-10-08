import React from 'react'

const LobbyWait = ({ players, size }) => {
  return (
    <div>
      <div className="text-white font-semibold my-2 underline">{ `Players (${players.length}/${size})`}</div>
      { players.map(player => (
        <div key={ player.order } className="flex items-end">
          { player.online ? 
            <svg className="bg-green-300 text-gray-700 rounded-full mb-1 fill-current" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            :
            <svg className="bg-red-400 text-white rounded-full mb-1 fill-current" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
          <div className="text-white px-2 mt-1">{ player.name }</div>
        </div>)) }
    </div>
  )
}

export default LobbyWait