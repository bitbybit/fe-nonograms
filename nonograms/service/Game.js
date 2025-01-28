import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'

import { Easy } from 'service/level/Easy.js'

/**
 * @typedef {{
 *   levels: GameConfig['levels']
 * }} GameProps
 */

export class Game {
  /**
   * @type {GameConfig}
   */
  #config

  /**
   * @type {GameState}
   */
  #state

  /**
   * @param {GameProps} props
   */
  constructor({ levels = [Easy] } = {}) {
    this.#config = new GameConfig({ levels })

    this.#state = new GameState({
      level: this.#config.levels[0]
    })

    console.log(this.#state)
  }
}
