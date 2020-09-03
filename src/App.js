import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './components/Home'
import New from './components/New'
import Join from './components/Join'

const Lobby = lazy(() => import('./components/Lobby') )


const App = () => {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/" exact><Home /></Route>
        <Route path="/new"><New /></Route>
        <Route path="/join"><Join /></Route>
        <Route path="/lobby">
          <Suspense fallback={<div>Loading</div>}>
            <Lobby />
          </Suspense>
          
        </Route>
      </Switch>
    </Router>
  )
}

export default App