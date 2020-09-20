import React, { useState, useEffect, } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import io from '../Socket'
import db from '../db'
import CenterBoard from './game/center/CenterBoard'
import PlayerBoard from './game/player/PlayerBoard'
import Round from './game/player/Round'
import ChoiceBoard from './game/player/ChoiceBoard'

const Lobby = () => {
  const location = useLocation()
  const history = useHistory()
  const locationUuid = location.state && location.state.uuid
  const locationGame = location.state && location.state.game
  const [uuid, setUuid] = useState(null)
  const [lobby, setLobby] = useState({ room: '', players: [], size: 3, board: { round: 1, quest: [] }, deck: [] })
  const [playerInfo, setPlayerInfo] = useState(
    { name: '',
      room: '',
      socket: '',
      host: false,
      totalScore: 0,
      roundScore: 0,
      artifacts: [],
      choiceMade: false,
      choice: null })
  
  const updateGame = async game => {
    try {
      const gameUpdate = await db.game.put(game)
      setLobby(game)
    } catch (error) {
    }  
  }

  const updatePlayer = async player => {
    try {
      const playerUpdate = await db.player.put(player)
      setPlayerInfo(player)
    } catch (error) {
    }  
  }

  const saveUuid = async uuid => {
    try {
      const uuidUpdate = await db.uuid.put({uuid: uuid})
      setUuid(uuid)
    } catch (error) {
    }  
  }

  const loadSave = async () => {
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      if(storedUuid[0] && storedGame[0]) {
        setUuid(storedUuid[0].uuid)
        setLobby(storedGame[0])
      } else {
      }
    } catch (error) {
    } 
  }

  const clearGame = () => {
    db.game.clear()
    db.uuid.clear()
    history.push('/')
  }
  
  useEffect(() => {
    loadSave()

    io.playerInit(locationGame, locationUuid)

    io.playerUuid((uuid) => {
      saveUuid(uuid)
    })

    io.gameUpdate(update => {
      updateGame(update)
    })

    io.playerUpdate(update => {
      updatePlayer(update)
    })

    io.gameReset(() => clearGame())

    return () => {
      io.disconnect()
    }
  }, [])

  const playerChoice = ({ target: { name } }) => {
    setPlayerInfo({ ...playerInfo, choice: name == 'torch', choiceMade: true })
    io.sendChoice({ uuid: uuid, choice: name == 'torch' })
  }

  const lobbyPlayers = lobby.players.map((player, ind) =>
    (<li key={ ind } className={`text-center p-2 ${ player.online ? '' : 'bg-red-600'}`}>
      <div className={`py-1 px-2 ${ player.choiceMade ? 'bg-green-400 font-bold' : 'bg-yellow-400'}`}>
        { player.name }
      </div>
      <div className="flex flex-col justify-center">
        <ChoiceBoard player={ player } playerChoice='opponent'/>
        { player.online ? <Round score={ player.roundScore } artifacts={ player.artifacts}/> : <div className="text-xl transform rotate-90">:(</div> }
      </div>
    </li>))

  return (
    <div className="p-2 flex flex-col flex-wrap">
      {/*///// admin /////*/}
      <div className="flex p-1 bg-yellow-200 mr-auto">
        <button className="inline-block p-1 bg-gray-300" to="/" onClick={ clearGame } >Clear Game</button>
        <div className="p-1">Code: { lobby.room }</div>
        <div className="p-1">uuid: { uuid && uuid.substring(0, 4) }</div>
      </div>

      {/*///// game /////*/}
      <div className="p-1 flex flex-col flex-wrap justify-center bg-blue-100">
        <div className="text-lg text-center">Game</div>

        {/*///// player list /////*/}
        <ul className="flex flex-row justify-around">
          { lobbyPlayers }
        </ul>

        {/*///// center board /////*/}
        <CenterBoard board={ lobby.board }/>

        {/*///// player board /////*/}
        <PlayerBoard player={ playerInfo } playerChoice={ playerChoice }/>
      </div>
    </div>
  )
}

export default Lobby