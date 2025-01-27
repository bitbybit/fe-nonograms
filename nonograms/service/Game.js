import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'
import { GameLevel } from 'service/model/GameLevel.js'
import { GameTemplate } from 'service/model/GameTemplate.js'

import easyArrowUp from 'board/easy/arrow-up.json'
import easyCheckerboard from 'board/easy/checkerboard.json'
import easyCross from 'board/easy/cross.json'
import easySquare from 'board/easy/square.json'
import easyTriangle from 'board/easy/triangle.json'

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
  constructor({
    levels = [
      new GameLevel({
        name: 'easy',
        title: 'Easy',
        templates: [
          new GameTemplate({
            board: easySquare
          }),
          new GameTemplate({
            board: easyArrowUp
          }),
          new GameTemplate({
            board: easyCross
          }),
          new GameTemplate({
            board: easyTriangle
          }),
          new GameTemplate({
            board: easyCheckerboard
          })
        ]
      })
    ]
  } = {}) {
    this.#config = new GameConfig({ levels })

    this.#state = new GameState({
      level: this.#config.levels[0]
    })
  }
}
