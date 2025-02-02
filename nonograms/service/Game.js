import { State } from 'service/game/State.js'
import { Container } from 'service/ui/Container.js'
import { Selector } from 'service/ui/Selector.js'
import { Reset } from 'service/ui/button/Reset.js'
import { Stopwatch } from 'service/ui/Stopwatch.js'
import { Canvas } from 'service/ui/Canvas.js'
import { Sound } from 'service/ui/Sound.js'
import { Save } from 'service/ui/button/Save.js'
import { Load } from 'service/ui/button/Load.js'
import { Light } from 'service/ui/button/Light.js'
import { Dark } from 'service/ui/button/Dark.js'

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
  #saveButton

  /**
   * @type {Load}
   */
  #loadButton

  /**
   * @type {Light}
   */
  #themeLightButton

  /**
   * @type {Dark}
   */
  #themeDarkButton

  /**
   * @param {GameProps} props
   */
  constructor({ levels = [easyLevel, mediumLevel, hardLevel] } = {}) {
    this.#state = new State({
      levels
    })

    this.#initContainer()
    this.#initSelector()
    this.#initResetButton()
    this.#initStopwatch()
    this.#initCanvas()
    this.#initSound()
    this.#initLoader()
    this.#initTheme()
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

  #initResetButton() {
    const resetButton = new Reset({
      $container: this.#container.reset.$element
    })

    resetButton.events.addEventListener('click', () => {
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
    this.#saveButton = new Save({
      $container: this.#container.loader.$element
    })

    this.#loadButton = new Load({
      $container: this.#container.loader.$element
    })

    this.#saveButton.events.addEventListener('click', () => {
      this.#saveGame()
    })

    this.#loadButton.events.addEventListener('click', () => {
      this.#loadGame()
    })

    if (this.#state.hasSavedState) {
      this.#showLoadButton()
    }
  }

  #initTheme() {
    this.#themeLightButton = new Light({
      $container: this.#container.theme.$element
    })

    this.#themeDarkButton = new Dark({
      $container: this.#container.theme.$element
    })

    this.#themeLightButton.events.addEventListener('click', () => {
      this.#setLightTheme()
    })

    this.#themeDarkButton.events.addEventListener('click', () => {
      this.#setDarkTheme()
    })
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

  #setLightTheme() {
    document.documentElement.setAttribute('data-bs-theme', 'light')

    this.#canvas.setLightTheme()
    this.#drawCanvas()

    this.#showDarkButton()
  }

  #setDarkTheme() {
    document.documentElement.setAttribute('data-bs-theme', 'dark')

    this.#canvas.setDarkTheme()
    this.#drawCanvas()

    this.#showLightButton()
  }

  #showLoadButton() {
    this.#saveButton.$element.classList.add('d-none')
    this.#loadButton.$element.classList.remove('d-none')
  }

  #showSaveButton() {
    this.#loadButton.$element.classList.add('d-none')
    this.#saveButton.$element.classList.remove('d-none')
  }

  #showLightButton() {
    this.#themeDarkButton.$element.classList.add('d-none')
    this.#themeLightButton.$element.classList.remove('d-none')
  }

  #showDarkButton() {
    this.#themeLightButton.$element.classList.add('d-none')
    this.#themeDarkButton.$element.classList.remove('d-none')
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
