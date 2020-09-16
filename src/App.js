import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './components/Home'
import New from './components/New'
import Join from './components/Join'
import Admin from './components/Admin'
import Lobby from './components/Lobby'

const App = () => {
  return (
    <div>
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact><Home /></Route>
          <Route path="/admin"><Admin /></Route>
          <Route path="/new"><New /></Route>
          <Route path="/join"><Join /></Route>
          <Route path="/lobby"><Lobby /></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App