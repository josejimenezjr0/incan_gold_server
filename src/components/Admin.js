import React, { useState } from 'react'
import axios from 'axios'

const Admin = () => {
  const [ games, setGames ] = useState([])
  const [ players, setPlayers ] = useState([])

  const handleUpdate = async () => {
    const res = await axios.get('/games')
    setGames(res.data.games)
    setPlayers(res.data.players)
  }

  const listGames = Object.entries(games).map(([room, game], ind) => (
    <li className="px-2" key={ ind }>
      <div className="bg-indigo-100 p-2">
        <div>Code: { room }</div>
        <ul>
          { game.players.map((player, ind) => (
            <li className="py-2" key={ ind }>
              <div className="p-2 bg-orange-300">
                <div>Name: { player.name }</div>
                <div>ID: { player.uuid.substring(0, 4) }</div>
              </div>
            </li>
          )) }
        </ul>
        <div>Size: { game.size }</div>
      </div>
    </li>
  ))

    const listPlayers = Object.entries(players).map(([uuid, info], ind) => (
    <li className="px-2" key={ ind }>
      <div className="bg-indigo-100 p-2">
        <div>Player: { info.name }</div>
        <div className="p-2 bg-orange-300">
          <div>Room: { info.room }</div>
          <div>Host: { info.host }</div>
          <div>ID: { uuid.substring(0, 4) }</div>
          <div>Socket: { info.socket.substring(0, 4) }</div>
        </div>
      </div>
    </li>
  ))


  return (
    <div className="p-4 flex flex-col flex-wrap items-center justify-center">
      <button className="inline-block mt-2 p-1 mx-auto bg-green-300" onClick={ handleUpdate } >Update</button>
      <div>
        <div className="text-lg text-center">Games</div>
        <ul className="p-4 flex">
          { listGames }
        </ul>
      </div>
      <div>
        <div className="text-lg text-center">Players</div>
        <ul className="p-4 flex">
          { listPlayers }
        </ul>
      </div>
    </div>
  )
}

export default Admin