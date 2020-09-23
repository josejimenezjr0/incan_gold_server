import React, { useState } from 'react'
import axios from 'axios'

const Admin = () => {
  const [ games, setGames ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [show, setShow] = useState(false)

  const handleUpdate = async () => {
    const res = await axios.get('/games')
    console.log('res.data: ', res.data);
    setGames(res.data.games)
    setPlayers(res.data.players)
  }

  const listGames = Object.entries(games).map(([room, game], ind) => (
    <li className="px-2" key={ ind }>
      <div className="bg-indigo-100 p-2">
        <div>Room: { room }, Size: { game.size }</div>
        <div>
          <div>
            <p>Quest - Round: { game.board.round }</p>
            <ul className="bg-purple-400">
              { game.board.quest.map((card, ind) => <li key={ ind }>{ card.card } - value: { card.value }</li>) }
            </ul>
          </div>
          <div>
            <button className="inline-block mt-2 p-1 mx-auto bg-green-300" onClick={ () => setShow(cur => !cur) }>Deck</button>
            <div className={`${show ? '' : 'hidden'}`}>
              { JSON.stringify(game.deck) }
            </div>
          </div>
        </div>
        <ul>
          { game.players.map((player, ind) => (
            <li className="py-2" key={ ind }>
              <div className="p-2 bg-orange-300">
                <div className={ player.online ? 'bg-green-700' : 'bg-red-700'}> ID: { player.uuid.substring(0, 4) }</div>
                <div>Artifiacts: { JSON.stringify(player.artifacts) }</div>
                <div className={ player.choiceMade ? 'bg-green-700' : 'bg-red-700'}>{ player.choiceMade ? `Choice: ${player.choice}` : 'choiceMade'}</div>
                <div>Round Score: { player.roundScore }</div>
              </div>
            </li>
          )) }
        </ul>
      </div>
    </li>
  ))

    const listPlayers = Object.entries(players).map(([uuid, info], ind) => (
    <li className="px-2" key={ ind }>
      <div className="bg-indigo-100 p-2">
        <div>Player: { uuid.substring(0, 4) }</div>
        <div className="p-2 bg-orange-300">
          <div>Room: { info.room }</div>
          <div>Host: { `${info.host}` }</div>
          <div>Socket: { info.socket.substring(0, 4) }</div>
          <div>Choice: { `${info.choice}` }</div>
          <div>Total Score: { info.totalScore }</div>
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