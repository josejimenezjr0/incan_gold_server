import React, { useEffect, useReducer, createContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './components/Home'
import Admin from './components/Admin'
import Lobby from './components/Lobby'
import { db2 } from './db'
import { reducer, initialState } from './redux'

export const GameContext = createContext()

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  /**
   * checks local dexieDB for a saved game and redirects to Lobby componenet if there is a saved game
   */
  const checkDB = async () => {
    try {
      const init = await db2.init.toArray()
      if(init[0]) {
        console.log('init: ', init);
      } else {
        console.log('Nothing in db2');
      }
    } catch (error) {
      console.log('error: ', error);
    } 
  }

  useEffect(() => {
    checkDB()
  }, [])

  return (
    <GameContext.Provider value={ { state, dispatch } }>
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={ Home } />
          <Route path="/admin" component={ Admin } />
          <Route path="/lobby" component={ Lobby } />
        </Switch>
      </Router>
    </GameContext.Provider>
  )
}

export default App