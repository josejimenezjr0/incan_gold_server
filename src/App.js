import React, { useState, useEffect } from "react"
import Home from './components/Home'

const App = () => {
  const [ newGame, setNewGame ] = useState(false)

  const handleNew = () => setNewGame(true)

  return (
    <div>
      <button type="button" onClick={ handleNew }>New Game</button>
      { newGame && <Home /> }
    </div>
  )
}

export default App