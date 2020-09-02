import React from "react"
import Home from './components/Home'
import New from './components/New'
import Join from './components/Join'
import Lobby from './components/Lobby'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact><Home /></Route>
        <Route path="/new"><New /></Route>
        <Route path="/join"><Join /></Route>
        <Route path="/lobby"><Lobby /></Route>
      </Switch>
    </Router>
  )
}

export default App