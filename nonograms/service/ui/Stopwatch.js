import { Component } from 'service/ui/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ComponentProps>} StopwatchProps
 */

export class Stopwatch extends Component {
  /**
   * @type {boolean}
   */
  #running = false

  /**
   * @type {number}
   */
  #startTime = 0

  /**
   * @type {number}
   */
  elapsedTime = 0

  /**
   * @param {StopwatchProps} props
   */
  constructor({ $container } = {}) {
    super({
      $container,
      tagName: 'span',
      name: 'stopwatch'
    })
  }

  start() {
    if (!this.#running) {
      this.#startTime = Date.now() - this.elapsedTime
      this.#running = true

      this.#update()
    }
  }

  stop() {
    if (this.#running) {
      this.elapsedTime = Date.now() - this.#startTime
      this.#running = false
    }
  }

  reset() {
    this.#running = false
    this.elapsedTime = 0
    this.$element.textContent = ''
  }

  #update() {
    if (this.#running) {
      this.$element.textContent = this.elapsedTimeFormatted

      requestAnimationFrame(() => this.#update())
    }
  }

  /**
   * @returns {string}
   */
  get elapsedTimeFormatted() {
    const totalSeconds = Math.floor(
      (this.#running ? Date.now() - this.#startTime : this.elapsedTime) / 1000
    )

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''
    const formattedMinutes = `${String(minutes).padStart(2, '0')}:`
    const formattedSeconds = String(seconds).padStart(2, '0')

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`
  }
}
