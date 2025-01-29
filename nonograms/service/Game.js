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
      $container: this.#container.$element
    })

    this.#canvas.events.addEventListener('mount', () => {
      this.#drawCanvas()
      window.addEventListener('resize', boundDrawCanvas)
    })

    this.#canvas.events.addEventListener('unmount', () => {
      window.removeEventListener('resize', boundDrawCanvas)
    })

    this.#canvas.events.addEventListener('cell-click', (event) => {
      const { x, y, value } = event.detail

      this.#state.cells[y][x] = value
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
