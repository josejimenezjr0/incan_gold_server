import React, { useState } from 'react'
import axios from 'axios'

const Admin = () => {
  const [ games, setGames ] = useState([])
  const [ rooms, setRooms ] = useState([])

  const handleUpdate = async () => {
    const res = await axios.get('/games')
    console.log('res: ', res);
    setGames(res.data)
  }

  const listGames = games.map((game, ind) => (
    <li key={ ind }>
      <div>Code: { game.code }</div>
      <ul>
        { game.players.map((player, ind) => {
          <li key={ ind }>
            <div>Name: { player.name }</div>
            <div>ID: { player.id }</div>
            <div>Socket: { player.socket }</div>
          </li>
        }) }
      </ul>
      <div>Size: { game.size }</div>
    </li>
  ))

  return (
    <div className="p-8 flex-col flex-wrap items-center justify-center">
    <button className="inline-block mt-2 p-1 mx-auto bg-green-300" onClick={ handleUpdate } >Update</button>
      <div>Games</div>
      <ul>
        { listGames }
      </ul>
    </div>
  )
}

export default Admin