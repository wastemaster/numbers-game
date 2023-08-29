import { useState } from 'react'
import './App.css'
import Game from './components/Game.jsx'


function getVersion() {
    return document.head.querySelector("[name~=build-version][content]").content;
}

function App() {

  return (
    <>
      <h1>Numbers</h1>
      <Game />

      <div className="note">
         <p>
            This is the version of <a href="https://numbers.mokoron.ru/">Numbers game</a> written with React. <a href="https://github.com/wastemaster/numbers-game">Source codes</a> are available on github.
         </p>
         <p>
            Version: {getVersion()}
         </p>
      </div>

      <div className="footer">
        &copy; 2023 Evgeny Chernyshov. All Rights Reserved
      </div>
    </>
  )
}

export default App
