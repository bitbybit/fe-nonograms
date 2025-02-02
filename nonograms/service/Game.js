import { GameConfig } from 'service/model/GameConfig.js'
import { GameState } from 'service/model/GameState.js'
import { Container } from 'service/ui/Container.js'
import { Selector } from 'service/ui/Selector.js'
import { Reset } from 'service/ui/Reset.js'
import { Stopwatch } from 'service/ui/Stopwatch.js'
import { Canvas } from 'service/ui/Canvas.js'
import { Sound } from 'service/ui/Sound.js'

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
   * @type {string[]}
   * @readonly
   */
  #soundCanvasEvents = ['clear', 'fill', 'placeholder']

  /**
   * @type {GameConfig}
   */
  #config

  /**
   * @type {GameState}
   */
  #state

  /**
   * @type {Container}
   */
  #container

  /**
   * @type {Stopwatch}
   */
  #stopwatch

  /**
   * @type {Canvas}
   */
  #canvas

  /**
   * @type {Sound}
   */
  #sound

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
    this.#initSound()
  }

  #initState() {
    this.#state = new GameState({
      level: this.#config.levels[0]
    })
  }

  #initContainer() {
    this.#container = new Container()
  }

  #initSelector() {
    const selector = new Selector({
      $container: this.#container.selector.$element,
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
      $container: this.#container.reset.$element
    })

    reset.events.addEventListener('click', () => {
      this.#resetCurrentBoard()
    })
  }

  #initStopwatch() {
    this.#stopwatch = new Stopwatch({
      $container: this.#container.stopwatch.$element
    })
  }

  #initCanvas() {
    const boundDrawCanvas = this.#drawCanvas.bind(this)

    this.#canvas = new Canvas({
      $container: this.#container.canvas.$element
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
      async ({ detail }) => {
        this.#startStopwatch()

        const { x, y, value } = detail
        this.#state.cells[y][x] = value

        await this.#checkResult()
      }
    )
  }

  #initSound() {
    this.#sound = new Sound()

    this.#soundCanvasEvents.forEach((event) =>
      this.#canvas.events.addEventListener(event, () => this.#sound.play(event))
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
    this.#container.stopwatch.$element.classList.remove('bg-secondary-subtle')
    this.#container.stopwatch.$element.classList.add('bg-dark-subtle')

    this.#stopwatch.start()
  }

  #resetStopwatch() {
    this.#container.stopwatch.$element.classList.remove('bg-dark-subtle')
    this.#container.stopwatch.$element.classList.add('bg-secondary-subtle')

    this.#stopwatch.reset()
  }

  #resetCurrentBoard() {
    this.#resetStopwatch()

    this.#canvas.clearCells()
    this.#state.initDefaultCells()
  }

  async #checkResult() {
    if (this.#state.isBoardCompleted) {
      this.#stopwatch.stop()

      await this.#sound.play('win')

      alert(
        `Great! You have solved the nonogram in ${this.#stopwatch.elapsedTimeFormatted} seconds!`
      )

      this.#resetCurrentBoard()
    }
  }
}
