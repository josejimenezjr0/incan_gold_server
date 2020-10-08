import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import axios from 'axios'
import db from '../db'


const Home = ({ loadSave }) => {
  const checkDB = async () => {
    try {
      const storedUuid = await db.table('uuid').toArray()
      const storedGame = await db.table('game').toArray()
      const storedPlayer = await db.table('player').toArray()
      if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
        history.push({ pathname:'/lobby', state: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0]} })
      } else {
        console.log('Missing some or all info, starting new');
      }
      // if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
      //   console.log('???????');
      //   // setLoadSave({ game: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0] } })
      //   setLoadSave([storedUuid[0].uuid, storedGame[0], storedPlayer[0]])
      //   // setLoadSave({ show: true, gameSave: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0] } })
      //   // history.push({ pathname:'/lobby', state: { uuid: storedUuid[0], game: storedGame[0] } })
      //   // history.push({ pathname:'/lobby', state: { uuid: storedUuid[0], game: storedGame[0] } })
      //   // history.push('/')
      // } else {
      //   // setLoadSave({ show: false })
      //   console.log('Missing some or all info, starting new');
      // }
      } catch (error) {
    } 
  }

  useEffect(() => {
    checkDB()
  }, [])


  // console.log('loadSave: ', loadSave);
  // console.log('show: ', show);
  // console.log('Home - gameSave: ', gameSave);
  const history = useHistory()
  const [ game, setGame ] = useState({ name: '', code: '', size: '', init: true, join: false })
  const [joinInfo, setJoinInfo] = useState({ found: true, checking: false })

  // if(show) {
  //   console.log('show: ', show);
  //   console.log('history: ', history);
  //   // history.push('/lobby')
  //   history.push({ pathname:'/lobby', state: gameSave })
  // }
  // else {
  //   console.log('no save');
  // }

  // if(loadSave.length !== 0) {
  //   console.log('Home redirect');
  //   // history.push('/lobby')
  //   // history.push({ pathname:'/lobby', state: { uuid: loadSave[0], game: loadSave[1] } })
  //   <Redirect to={ { pathname: "/lobby", state: { uuid: loadSave[0], game: loadSave[1] } } }/>
  // }
  // else {
  //   console.log('no save');
  // }

  const handleInput = e => {
    const { target: { name, value } } = e
    setGame(({ ...game, [name]: value }))
  }

  const checkJoin = async room => {
    setJoinInfo({ found: true, checking: true })
    try {
      const res = await axios.post('/checkjoin', { room: room })
      setJoinInfo({ found: res.data, checking: false })
      if(res.data) history.push({ pathname: "/lobby", state: { game: game } })
    } catch (error) {
      console.log(error)
    }
  }

  const makeGame = () => {
    history.push({ pathname: "/lobby", state: { game: game } })
  }

  const toggleJoin = e => {
    setJoinInfo({ found: true, checking: false })
    const { target: { name } } = e
    setGame({ ...game, join: name === 'join' })
  }

  const allInfo = game.join ? (game.name === '') || (game.code === '') : (game.name === '') || (isNaN(game.size) || game.size === '')

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs mt-8">
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-around mb-6">
            <div className="mb-4">
              <button className={`${ !game.join ? 'bg-blue-400 cursor-default' : 'text-blue-500 hover:bg-blue-200 hover:text-blue-900 focus:shadow-outline'} text-gray-900 tracking-wide font-bold py-2 px-4 rounded focus:outline-none`} name="new" onClick={ toggleJoin }>New</button>
            </div>
            <div className="mb-4">
              <button className={`${ game.join ? 'bg-blue-400 cursor-default' : 'text-blue-500 hover:bg-blue-200 hover:text-blue-900 focus:shadow-outline'} text-gray-900 tracking-wide font-bold py-2 px-4 rounded focus:outline-none`} name="join" onClick={ toggleJoin }>Join</button>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="block text-gray-700 font-bold mb-2">Name</p>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" type="text" placeholder="enter name" value={ game.name } onChange={ handleInput }/>
            </div>
            <div className="mb-4">
              <p className="block text-gray-700 font-bold mb-2">{ game.join ? 'Code' : 'Players' }</p>
              { game.join ? 
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="code" placeholder="enter code" value={ game.code } onChange={ handleInput }/>
                :
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="size" type="text" placeholder="3 - 8 players" value={ game.size } onChange={ handleInput }/> }
                
            </div>
            <div className="flex items-center justify-center">
            { game.join ? 
              <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${allInfo && 'opacity-50' }`} disabled={ allInfo } onClick={ () => checkJoin(game.code) }>Join Game!</button>
              :
              <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${allInfo && 'opacity-50' }`} disabled={ allInfo } onClick={ makeGame }>Make Game!</button> }
              
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          { !joinInfo.found && <div className={`bg-red-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Game not found.</div> }
          { joinInfo.checking && <div className={`bg-orange-300 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Searching...</div> }
        </div>
      </div>
    </div>
  )
}

export default Home