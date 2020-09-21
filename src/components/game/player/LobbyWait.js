import React from 'react'

const LobbyWait = ({ player: { online, name } }) => {
  return (
    <div className={`text-center p-2 ${ online ? 'bg-green-400' : 'bg-red-600'}`}>
      <div className="font-bold underline">
        { name }
      </div>
      <div>{ online ? 'Ready' : 'disconnected'}</div>
    </div>
  )
}

export default LobbyWait