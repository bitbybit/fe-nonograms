import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'
import { Component } from 'service/Component.js'
import { Selector } from 'service/Selector.js'
import { Canvas } from 'service/Canvas.js'

import { easyLevel } from 'service/level/easy.js'
import { mediumLevel } from 'service/level/medium.js'
import { hardLevel } from 'service/level/hard.js'

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
  #selectorWrapper

  /**
   * @type {Component}
   */
  #canvasWrapper

  /**
   * @type {Canvas}
   */
  #canvas

  /**
   * @param {GameProps} props
   */
  constructor({ levels = [easyLevel, mediumLevel, hardLevel] } = {}) {
    this.#config = new GameConfig({ levels })

    this.#initState()
    this.#initContainer()
    this.#initSelector()
    this.#initCanvas()
  }

  #initState() {
    this.#state = new GameState({
      level: this.#config.levels[0]
    })
  }

  #initContainer() {
    const container = new Component({
      name: 'container',
      classList: ['container']
    })

    const rows = new Component({
      name: 'rows',
      classList: ['row'],
      $container: container.$element
    })

    this.#selectorWrapper = new Component({
      name: 'selector-wrapper',
      classList: ['col-6', 'p-2'],
      $container: rows.$element
    })

    this.#canvasWrapper = new Component({
      name: 'canvas-wrapper',
      classList: ['col-12', 'p-2', 'text-center'],
      $container: rows.$element
    })
  }

  #initSelector() {
    const selector = new Selector({
      $container: this.#selectorWrapper.$element,
      levels: this.#config.levels
    })

    selector.events.addEventListener(
      'update',
      /**
       * @param {SelectorPayload} payload
       */
      ({ detail }) => {
        this.#state.level = detail.level
        this.#state.template = detail.template

        this.#canvas.clearCells()
        this.#drawCanvas()
      }
    )
  }

  #initCanvas() {
    const boundDrawCanvas = this.#drawCanvas.bind(this)

    this.#canvas = new Canvas({
      $container: this.#canvasWrapper.$element
    })

    this.#canvas.events.addEventListener('mount', () => {
      this.#drawCanvas()
      window.addEventListener('resize', boundDrawCanvas)
    })

    this.#canvas.events.addEventListener('unmount', () => {
      window.removeEventListener('resize', boundDrawCanvas)
    })

    this.#canvas.events.addEventListener(
      'update',
      /**
       * @param {CanvasPayload} payload
       */
      ({ detail }) => {
        const { x, y, value } = detail

        this.#state.cells[y][x] = value
      }
    )
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
