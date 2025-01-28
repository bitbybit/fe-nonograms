import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'
import { Component } from 'service/Component.js'
import { Canvas } from 'service/Canvas.js'

import { Easy } from 'service/level/Easy.js'

/**
 * @typedef {{
 *   levels: GameLevel[]
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
   * @type {Component}
   */
  #container

  /**
   * @type {Canvas}
   */
  #canvas

  /**
   * @param {GameProps} props
   */
  constructor({ levels = [Easy] } = {}) {
    this.#config = new GameConfig({ levels })

    this.#initState()
    this.#initContainer()
    this.#initCanvas()
    this.#drawCanvas()
  }

  #initState() {
    this.#state = new GameState({
      level: this.#config.levels[0]
    })
  }

  #initContainer() {
    this.#container = new Component({
      name: 'container',
      classList: ['container']
    })
  }

  #initCanvas() {
    const boundDrawCanvas = this.#drawCanvas.bind(this)

    this.#canvas = new Canvas({
      $container: this.#container.$element,

      onMount() {
        window.addEventListener('resize', boundDrawCanvas)
      },

      onUnmount() {
        window.removeEventListener('resize', boundDrawCanvas)
      }
    })
  }

  #drawCanvas() {
    this.#canvas.draw({
      horCellAmount: this.#state.template.horCellAmount,
      horHints: this.#state.template.horHints,
      verCellAmount: this.#state.template.verCellAmount,
      verHints: this.#state.template.verHints
    })
  }
}
