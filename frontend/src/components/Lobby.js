import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import io from '../Socket'
import { db, db2 } from '../db'
import CenterBoard from './game/center/CenterBoard'
import TempleBoard from './game/center/TempleBoard'
import PlayerBoard from './game/player/PlayerBoard'
import OpponentsList from './game/opponents/OpponentsList'
import { GameContext } from '../App'

const ZERO = 'zero'
const TORCH = 'Torch'
const CAMP = 'Camp'

// const Lobby = ({ getNavGame }) => {
const Lobby = () => {
  const { state } = useContext(GameContext)
  const location = useLocation()
  const history = useHistory()
  //State passed from Home component history
  const locationUuid = location.state && location.state.uuid
  //State passed from Home component history
  const locationGame = location.state && location.state.game
  const [uuid, setUuid] = useState(null)
  const [lobby, setLobby] = useState(
    { 
      room: '',
      players: [],
      size: 3,
      questCycle: ZERO,
      round: 0,
      quest: [],
      deck: [] 
    })
  const [playerInfo, setPlayerInfo] = useState(
    {
      name: '',
      host: false,
      totalScore: 0,
      roundScore: 0,
      playerArtifacts: [],
      choiceMade: false,
      choice: 'Torch'
    })
  
  /**
   * receives game object, sets lobby state to game object and saves game object to dexieDB
   */
  const updateGame = async game => {
    console.log('updateGame: ', game);
    setLobby(game)
    // getNavGame({ players: game.players.filter(player => player.uuid !== uuid), questCycle: game.questCycle, onePlayer: game.onePlayer, size: game.size })
    try {
      await db.game.put(game)
      // await db2.savedData.put(game)
    } catch (error) {
      console.log('error: ', error);
    }  
  }

  /**
   * receives player object, sets playerinfo state to player object and saves player object to dexieDB
   */
  const updatePlayer = async player => {
    console.log('updatePlayer: ', player);
    setPlayerInfo(player)
    try {
      await db.player.put(player, uuid)
    } catch (error) {
      console.log('error: ', error);
    }  
  }

  /**
   * receives uuid, sets uuid state to uuid and saves uuid to dexieDB
   */
  const saveUuid = async uuid => {
    setUuid(uuid)
    try {
      await db.uuid.put({uuid: uuid})
    } catch (error) {
      console.log('error: ', error);
    }  
  }

  /**
   * Checks dexieDB for saved player and game data. If found, sets it in local state.
   */
  const loadSave = async () => {
    console.log('trying loadSave');
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      const storedPlayer = await db.table('player').toArray()
      if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
        console.log('now loading saved data');
        setUuid(storedUuid[0].uuid)
        setLobby(storedGame[0])
        setPlayerInfo(storedPlayer[0])
        io.playerInit(null, locationUuid)
        io.playerUuid(uuid => saveUuid(uuid))
        io.gameUpdate(update => updateGame(update))
        io.playerUpdate(update => updatePlayer(update))
      } else {
        console.log('Missing some or all info, starting new')
        io.playerInit(locationGame, locationUuid)
        io.playerUuid(uuid => saveUuid(uuid))
        io.gameUpdate(update => updateGame(update))
        io.playerUpdate(update => updatePlayer(update))
      }
    } catch (error) {
      console.log('error: ', error);
    } 
  }

  /**
   * erases data from dexieDB and redirects to App component
   */
  const clearGame = async () => {
    await db.game.clear()
    await db.uuid.clear()
    await db.player.clear()
    history.push('/')
  }
  
  /**
   * Try to load any saved data. SocketIO startup functions with saved data. Also clear any saved game state in socketIO
   */
  useEffect(() => {
    console.log('useReducer state', state);
    loadSave()
    ///////////
    //Async issue? loadSave but io starts right away?
    ///////////
    // io.playerInit(locationGame, locationUuid)
    // io.playerUuid(uuid => saveUuid(uuid))
    // io.gameUpdate(update => updateGame(update))
    // io.playerUpdate(update => updatePlayer(update))
    // io.gameReset(clearGame)
    //disconnect socket on unmount
    return () => io.disconnect()

  }, [])

  /**
   * Set flag for player having made a choice yet or not for Torch(stay) or Camp(leave)
   */
  const playerChoice = () => {
    //if they've already chosen before, ignore and return
    if(playerInfo.choiceMade === true) return
    updatePlayer({ ...playerInfo, choiceMade: true })
    //Send socket update with choice selection
    io.sendChoice({ uuid: uuid, choice: playerInfo.choice })
  }

  /**
   * Change between Torch or Camp selection
   */
  const toggleChoice = () => {
    console.log('playerInfo.choice: ', playerInfo.choice);
    console.log('boolean for choice: ', playerInfo.choice === TORCH ? CAMP : TORCH);
    //clear choiceMade flag and toggle previous choice
    updatePlayer({ ...playerInfo, choice: playerInfo.choice === TORCH ? CAMP : TORCH, choiceMade: false })
    console.log('playerInfo.choice: ', playerInfo.choice);
    //send socket update with new choice
    io.choiceToggle({ uuid: uuid, choice: playerInfo.choice === TORCH ? CAMP : TORCH })
  }

  const roundStart = () => io.startRound(lobby.room)
  const choicesReveal = () => io.revealChoices(lobby.room)
  ///////////
  //different parameter?
  ///////////
  const turnStart = () => io.startTurn({ room: lobby.room })

  //determine player list in lobby

  //remove self from player list
  const otherPlayers = lobby.players.filter(player => player.uuid !== uuid)
  //make Opponent list
  const gamePlayers = otherPlayers.map((player, ind) => {
    return (
      <OpponentsList 
        key={ ind }
        player={ player }
        questCycle={ lobby.questCycle }
        onePlayer={ lobby.onePlayer }
      />)
    })

  //check if all expected players are in the lobby
  ///////////
  //May need to fix for players dropping but coming back in
  //Possibly check if game has started and not rely on sizeWait if so
  ///////////
  const sizeWait = lobby.players.length === lobby.size

  return (
    <div className="flex justify-center h-screen sm:h-auto">
      <div className="w-full max-w-sm mt-4 h-full sm:h-auto">
        <div className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full sm:h-auto">
          <div className="flex flex-col pt-2 pb-16 h-full sm:h-auto">
            {/* Hide game if not all players are present. reference sizeWait comment above for possible change */}
            <div className={`${sizeWait && 'hidden'} flex justify-between items-center bg-blue-200 text-gray-900 rounded-lg mt-2 px-4`}>
              <div className="flex p-2 items-center justify-center">
                {/* show game code for other players to join */}
                Code: <span className="bg-gray-600 text-white tracking-wide font-semibold py-1 px-2 ml-2 rounded">{ lobby.room }</span>
              </div>
              <div className="font-semibold underline">{ `Players (${lobby.players.length}/${lobby.size})`}</div>
            </div>
            {/* Temple layout for round progress */}
            <TempleBoard
              roundStart={ roundStart } 
              round={ lobby.round } 
              questCycle={ lobby.questCycle } 
              sizeWait={ sizeWait }
            />
            <div className="flex h-full">
              {/* Player section with score progress and hidden score in Tent component */}
              <PlayerBoard 
                playerChoice={ playerChoice }
                toggleChoice={ toggleChoice }
                player={ playerInfo }
                questCycle={ lobby.questCycle }
                onePlayer={ lobby.onePlayer }
              />
              {/* Turn progress section with current turn cards and treasures */}
              <CenterBoard
                choicesReveal={ choicesReveal }
                turnStart={ turnStart }
                game={ lobby }
                playerInfo={ playerInfo }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby