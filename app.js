import { Game } from 'service/Game.js'

const init = async function () {
  try {
    new Game()
  } catch (e) {
    console.error(e)
  }
}

document.addEventListener('DOMContentLoaded', init)
