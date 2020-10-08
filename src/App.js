import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './components/Home'
import New from './components/New'
import Join from './components/Join'
import Admin from './components/Admin'
import Lobby from './components/Lobby'
// import db from './db'

const App = () => {
  // const history = useHistory()
  // const [loadSave, setLoadSave] = useState({ show: false })
  // const [loadSave, setLoadSave] = useState([])
  // console.log('loadSave: ', loadSave);
  // const [navGame, setNavGame] = useState({ players: [], questCycle: '', onePlayer: false, size: 3 })

  // const getNavGame = game => {
  //   console.log('game: ', game);
  //   setNavGame(game)
  // }

  // const checkDB = async () => {
  //   try {
  //     const storedUuid = await db.table('uuid').toArray()
  //     const storedGame = await db.table('game').toArray()
  //     const storedPlayer = await db.table('player').toArray()
  //     if(storedUuid[0] && storedGame[0] && storedPlayer[0]) {
  //       console.log('???????');
  //       // setLoadSave({ game: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0] } })
  //       setLoadSave([storedUuid[0].uuid, storedGame[0], storedPlayer[0]])
  //       // setLoadSave({ show: true, gameSave: { uuid: storedUuid[0].uuid, player: storedPlayer[0], game: storedGame[0] } })
  //       // history.push({ pathname:'/lobby', state: { uuid: storedUuid[0], game: storedGame[0] } })
  //       // history.push({ pathname:'/lobby', state: { uuid: storedUuid[0], game: storedGame[0] } })
  //       // history.push('/')
  //     } else {
  //       // setLoadSave({ show: false })
  //       console.log('Missing some or all info, starting new');
  //     }
  //   } catch (error) {
  //   } 
  // }

  // useEffect(() => {
  //   checkDB()
  // }, [])

  return (
    <div>
      <Router>
        {/* <Nav show={ loadSave.show } navGame={ navGame }/> */}
        <Nav />
        <Switch>
          <Route path="/" exact><Home /></Route>
          {/* <Route path="/" exact><Home loadSave={ loadSave }/></Route> */}
          <Route path="/admin"><Admin /></Route>
          <Route path="/new"><New /></Route>
          <Route path="/join"><Join /></Route>
          {/* <Route path="/lobby"><Lobby getNavGame={ getNavGame }/></Route> */}
          <Route path="/lobby"><Lobby /></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App