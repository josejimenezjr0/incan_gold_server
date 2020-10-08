import React, { useState, useEffect, } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import io from '../Socket'
import db from '../db'
import CenterBoard from './game/center/CenterBoard'
import TempleBoard from './game/center/TempleBoard'
import PlayerBoard from './game/player/PlayerBoard'
import OpponentsList from './game/opponents/OpponentsList'

const ZERO = 'zero'
const TORCH = 'Torch'
const CAMP = 'Camp'

// const Lobby = ({ getNavGame }) => {
const Lobby = () => {
  const location = useLocation()
  const history = useHistory()
  const locationUuid = location.state && location.state.uuid
  const locationGame = location.state && location.state.game
  const [uuid, setUuid] = useState(null)
  const [lobby, setLobby] = useState({ room: '', players: [], size: 3, questCycle: ZERO, round: 0, quest: [], deck: [] })
  const [playerInfo, setPlayerInfo] = useState({ name: '', host: false, totalScore: 0, roundScore: 0, playerArtifacts: [], choiceMade: false, choice: 'Torch' })
  
  const updateGame = async game => {
    console.log('updateGame: ', game);
    setLobby(game)
    // getNavGame({ players: game.players.filter(player => player.uuid !== uuid), questCycle: game.questCycle, onePlayer: game.onePlayer, size: game.size })
    try {
      await db.game.put(game)
    } catch (error) {
    }  
  }

  const updatePlayer = async player => {
    console.log('updatePlayer: ', player);
    setPlayerInfo(player)
    try {
      await db.player.put(player, uuid)
    } catch (error) {
    }  
  }

  const saveUuid = async uuid => {
    setUuid(uuid)
    try {
      await db.uuid.put({uuid: uuid})
    } catch (error) {
    }  
  }

  const loadSave = async () => {
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      const storedPlayer = await db.table('player').toArray()
      if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
        setUuid(storedUuid[0].uuid)
        setLobby(storedGame[0])
        setPlayerInfo(storedPlayer[0])
      } else {
        console.log('Missing some or all info, starting new')
      }
    } catch (error) {
    } 
  }

  const clearGame = async () => {
    await db.game.clear()
    await db.uuid.clear()
    await db.player.clear()
    history.push('/')
  }
  
  useEffect(() => {
    loadSave()
    io.playerInit(locationGame, locationUuid)
    io.playerUuid((uuid) => saveUuid(uuid))
    io.gameUpdate(update => updateGame(update))
    io.playerUpdate(update => updatePlayer(update))
    io.gameReset(clearGame)
    return () => io.disconnect()

  }, [])

  const playerChoice = () => {
    if(playerInfo.choiceMade === true) return
    updatePlayer({ ...playerInfo, choiceMade: true })
    io.sendChoice({ uuid: uuid, choice: playerInfo.choice })
  }

  const toggleChoice = () => {
    console.log('playerInfo.choice: ', playerInfo.choice);
    console.log('boolean for choice: ', playerInfo.choice === TORCH ? CAMP : TORCH);
    updatePlayer({ ...playerInfo, choice: playerInfo.choice === TORCH ? CAMP : TORCH, choiceMade: false })
    console.log('playerInfo.choice: ', playerInfo.choice);
    io.choiceToggle({ uuid: uuid, choice: playerInfo.choice === TORCH ? CAMP : TORCH })
  }

  const roundStart = () => io.startRound(lobby.room)
  const choicesReveal = () => io.revealChoices(lobby.room)
  const turnStart = () => io.startTurn({ room: lobby.room })

  const gamePlayers = lobby.players.filter(player => player.uuid !== uuid).map((player, ind) =>(<OpponentsList key={ ind } player={ player } questCycle={ lobby.questCycle } onePlayer={ lobby.onePlayer }/>))

  const sizeWait = lobby.players.length == lobby.size

  return (
    <div className="flex justify-center h-screen sm:h-auto">
      <div className="w-full max-w-sm mt-4 h-full sm:h-auto">
        <div className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full sm:h-auto">
          <div className="flex flex-col pt-2 pb-16 h-full sm:h-auto">
            <div className={`${sizeWait && 'hidden'} flex justify-between items-center bg-blue-200 text-gray-900 rounded-lg mt-2 px-4`}>
              <div className="flex p-2 items-center justify-center">
                Code: <span className="bg-gray-600 text-white tracking-wide font-semibold py-1 px-2 ml-2 rounded">{ lobby.room }</span>
              </div>
              <div className="font-semibold underline">{ `Players (${lobby.players.length}/${lobby.size})`}</div>
            </div>
            <TempleBoard round={ lobby.round } roundStart={ roundStart } questCycle={ lobby.questCycle } sizeWait={ sizeWait }/>
            <div className="flex h-full">
              <PlayerBoard player={ playerInfo } playerChoice={ playerChoice } toggleChoice={ toggleChoice } questCycle={ lobby.questCycle } onePlayer={ lobby.onePlayer }/>
              <CenterBoard choicesReveal={ choicesReveal } turnStart={ turnStart } game={ lobby } playerInfo={ playerInfo } />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby