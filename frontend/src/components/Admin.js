import React, { useState } from 'react'
import axios from 'axios'

const Admin = () => {
  const [ games, setGames ] = useState([])
  
  const [show, setShow] = useState(false)

  const handleUpdate = async () => {
    const res = await axios.get('/games')
    console.log('res.data: ', res.data);
    setGames(res.data)
  }

  const deleteGame = async room => {
    const res = await axios.post('/games', { room: room })
    console.log('sent post')
    console.log('res.data: ', res.data);
    setGames(res.data)
  }

  const vBool = (label, item) => <span>{label}: <span className={ item ? 'bg-green-700' : 'bg-red-700'}>{`${ item }`}</span></span>

  const listGames = games.map((game, ind) => (
    <li className="px-2" key={ ind }>
      <div className="bg-indigo-100 p-2">
        <button className="inline-block mt-2 p-1 mx-auto text-white font-bold bg-red-700" onClick={ () => deleteGame(game.room) }>Delete</button>
        <div>Room: { game.room }, Size: { game.size }, Spare: { game.spare }</div>
        <div>Artifiacts: { game.artifacts }, Hazards: { JSON.stringify(game.hazards) }</div>
        <div>{ vBool('endCamp', game.endCamp) }, { vBool('endHazard', game.endHazard) }</div>
        <div>Quest Cycle: { game.questCycle }, Round: { game.round }, { vBool('1Player', game.onePlayer) }</div>
        <div>
          <div>
            <ul className="bg-purple-400">
              { game.quest.map((card, ind) => <li key={ ind }>{ card.card } - { `${card.card === 'HazardQuestCard' ? `type: ${card.type}` : `value: ${card.value}` }` }</li>) }
            </ul>
          </div>
          <div>
            <button className="inline-block mt-2 p-1 mx-auto bg-green-300" onClick={ () => setShow(cur => !cur) }>Deck</button>
            <div className={`${show ? '' : 'hidden'}`}>
              { JSON.stringify(game.deck) }
            </div>
          </div>
        </div>
        <div>
        <p>Players</p>
          <ul>
            { game.players.map((player, ind) => (
              <li className="py-2" key={ ind }>
                <div className="p-2 bg-orange-300">
                  <div>{ vBool('uuid', player.uuid.substring(0, 4)) }, socketID: { player.socketID.substring(0, 4) }</div>
                  <div>Name: { player.name }, { vBool('Host', player.host) }</div>
                  <div>Artifiacts: { JSON.stringify(player.playerArtifacts) }</div>
                  <div>Total Score: { player.totalScore }, Round Score: { player.roundScore }</div>
                  <div>{ vBool('leftRound', player.leftRound) }, { vBool('showChoice', player.showChoice) }</div>
                  <div>{ vBool('choiceMade', player.choiceMade) }, { vBool('choice', player.choice) }</div>
                </div>
              </li>
            )) }
          </ul>
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
          { 
            games.length === 0 ? 
            <div className="text-lg font-bold bg-red-700">No games yet!</div>
            :
            <div>
              { listGames }
            </div>
          }
        </ul>
      </div>
    </div>
  )
}

export default Admin