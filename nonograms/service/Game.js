import { State } from 'service/game/State.js'
import { Container } from 'service/ui/Container.js'
import { Selector } from 'service/ui/Selector.js'
import { Reset } from 'service/ui/Reset.js'
import { Stopwatch } from 'service/ui/Stopwatch.js'
import { Canvas } from 'service/ui/Canvas.js'
import { Sound } from 'service/ui/Sound.js'
import { Save } from 'service/ui/Save.js'
import { Load } from 'service/ui/Load.js'

import { easyLevel } from 'service/level/easy.js'
import { mediumLevel } from 'service/level/medium.js'
import { hardLevel } from 'service/level/hard.js'

/**
 * @typedef {{
 *   levels: Level[]
 * }} GameProps
 */

/**
 * @typedef {{
 *   refill: boolean
 * }} DrawCanvasProps
 */

/**
 * @typedef {{
 *   restoreElapsedTime: boolean
 * }} BeginStopwatchProps
 */

export class Game {
  /**
   * @type {string[]}
   * @readonly
   */
  #soundCanvasEvents = ['clear', 'fill', 'placeholder']

  /**
   * @type {State}
   */
  #state

  /**
   * @type {Container}
   */
  #container

  /**
   * @type {Selector}
   */
  #selector

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
   * @type {Save}
   */
  #save

  /**
   * @type {Load}
   */
  #load

  /**
   * @param {GameProps} props
   */
  constructor({ levels = [easyLevel, mediumLevel, hardLevel] } = {}) {
    this.#state = new State({
      levels
    })

    this.#initContainer()
    this.#initSelector()
    this.#initReset()
    this.#initStopwatch()
    this.#initCanvas()
    this.#initSound()
    this.#initLoader()
  }

  #initContainer() {
    this.#container = new Container()
  }

  #initSelector() {
    this.#selector = new Selector({
      $container: this.#container.selector.$element,
      levels: this.#state.levels
    })

    this.#selector.events.addEventListener(
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
        this.#beginStopwatch()

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

  #initLoader() {
    this.#save = new Save({
      $container: this.#container.loader.$element
    })

    this.#load = new Load({
      $container: this.#container.loader.$element
    })

    this.#save.events.addEventListener('click', () => {
      this.#saveGame()
    })

    this.#load.events.addEventListener('click', () => {
      this.#loadGame()
    })

    if (this.#state.hasSavedState) {
      this.#showLoadButton()
    }
  }

  /**
   * @param {DrawCanvasProps} props
   */
  #drawCanvas({ refill = false } = {}) {
    this.#canvas.draw({
      horCellAmount: this.#state.template.horCellAmount,
      horHints: this.#state.template.horHints,
      verCellAmount: this.#state.template.verCellAmount,
      verHints: this.#state.template.verHints
    })

    if (refill) {
      this.#canvas.refillCells(this.#state.cells)
    }
  }

  /**
   * @param {BeginStopwatchProps} props
   */
  #beginStopwatch({ restoreElapsedTime = false } = {}) {
    this.#container.stopwatch.$element.classList.remove('bg-secondary-subtle')
    this.#container.stopwatch.$element.classList.add('bg-dark-subtle')

    if (restoreElapsedTime) {
      this.#stopwatch.elapsedTime = this.#state.elapsedTime
      this.#state.elapsedTime = 0
    }

    this.#stopwatch.start()
  }

  #pauseStopwatch() {
    this.#stopwatch.stop()

    this.#state.elapsedTime = this.#stopwatch.elapsedTime
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

  #saveGame() {
    this.#pauseStopwatch()
    this.#state.save()
    this.#showLoadButton()
  }

  #loadGame() {
    this.#resetStopwatch()

    this.#state.load()

    this.#drawCanvas({
      refill: true
    })

    this.#selector.select(this.#state.template)

    this.#beginStopwatch({
      restoreElapsedTime: true
    })

    this.#showSaveButton()
  }

  #showLoadButton() {
    this.#save.$element.classList.add('d-none')
    this.#load.$element.classList.remove('d-none')
  }

  #showSaveButton() {
    this.#load.$element.classList.add('d-none')
    this.#save.$element.classList.remove('d-none')
  }

  async #checkResult() {
    if (!this.#state.isBoardCompleted) {
      return
    }

    this.#stopwatch.stop()

    await this.#sound.play('win')

    alert(
      `Great! You have solved the nonogram in ${this.#stopwatch.elapsedTimeFormatted} seconds!`
    )

    this.#resetCurrentBoard()
  }
}
