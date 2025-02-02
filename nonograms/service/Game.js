import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'
import { Component } from 'service/ui/Component.js'
import { Selector } from 'service/ui/Selector.js'
import { Reset } from 'service/ui/Reset.js'
import { Stopwatch } from 'service/ui/Stopwatch.js'
import { Canvas } from 'service/ui/Canvas.js'

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
  #resetWrapper

  /**
   * @type {Component}
   */
  #stopwatchWrapper

  /**
   * @type {Component}
   */
  #canvasWrapper

  /**
   * @type {Stopwatch}
   */
  #stopwatch

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
    this.#initReset()
    this.#initStopwatch()
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
      classList: ['container', 'd-flex', 'flex-column']
    })

    const rows = new Component({
      name: 'rows',
      classList: ['row', 'flex-grow-1'],
      $container: container.$element
    })

    this.#selectorWrapper = new Component({
      name: 'selector-wrapper',
      classList: [
        'col-6',
        'p-2',
        'align-content-center',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })

    this.#resetWrapper = new Component({
      name: 'reset-wrapper',
      classList: [
        'col-3',
        'p-2',
        'align-content-center',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })

    this.#stopwatchWrapper = new Component({
      name: 'stopwatch-wrapper',
      classList: [
        'col-3',
        'p-2',
        'align-content-center',
        'text-center',
        'bg-secondary-subtle',
        'text-primary'
      ],
      $container: rows.$element
    })

    this.#canvasWrapper = new Component({
      name: 'canvas-wrapper',
      classList: [
        'col-12',
        'p-2',
        'd-flex',
        'flex-grow-1',
        'align-items-center',
        'justify-content-center'
      ],
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

        this.#resetStopwatch()

        this.#canvas.clearCells()
        this.#drawCanvas()
      }
    )
  }

  #initReset() {
    const reset = new Reset({
      $container: this.#resetWrapper.$element
    })

    reset.events.addEventListener('click', () => {
      this.#resetCurrentBoard()
    })
  }

  #initStopwatch() {
    this.#stopwatch = new Stopwatch({
      $container: this.#stopwatchWrapper.$element
    })
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
        this.#startStopwatch()

        const { x, y, value } = detail
        this.#state.cells[y][x] = value

        this.#checkResult()
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

  #startStopwatch() {
    this.#stopwatchWrapper.$element.classList.remove('bg-secondary-subtle')
    this.#stopwatchWrapper.$element.classList.add('bg-dark-subtle')

    this.#stopwatch.start()
  }

  #resetStopwatch() {
    this.#stopwatchWrapper.$element.classList.remove('bg-dark-subtle')
    this.#stopwatchWrapper.$element.classList.add('bg-secondary-subtle')

    this.#stopwatch.reset()
  }

  #resetCurrentBoard() {
    this.#resetStopwatch()

    this.#canvas.clearCells()
    this.#state.initDefaultCells()
  }

  #checkResult() {
    if (this.#state.isBoardCompleted) {
      this.#stopwatch.stop()

      alert(
        `Great! You have solved the nonogram in ${this.#stopwatch.elapsedTimeFormatted} seconds!`
      )

      this.#resetCurrentBoard()
    }
  }
}
