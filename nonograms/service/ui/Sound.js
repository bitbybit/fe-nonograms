import { Component } from 'service/ui/Component.js'

/**
 * @type {string}
 */
import soundClear from 'assets/sound/clear.wav'

/**
 * @type {string}
 */
import soundFill from 'assets/sound/fill.wav'

/**
 * @type {string}
 */
import soundPlaceholder from 'assets/sound/placeholder.wav'

/**
 * @type {string}
 */
import soundWin from 'assets/sound/win.mp3'

/**
 * @typedef {{
 *   name: string
 *   src: string
 *   type: string
 * }} PlayerProps
 */

/**
 * @typedef {{
 *   name: string
 *   src: string
 *   type: string
 * }} PlayerSound
 */

export class Sound extends Component {
  /**
   * @type {PlayerSound[]}
   * @readonly
   */
  #sources = [
    {
      name: 'clear',
      src: soundClear,
      type: 'audio/wav'
    },
    {
      name: 'fill',
      src: soundFill,
      type: 'audio/wav'
    },
    {
      name: 'placeholder',
      src: soundPlaceholder,
      type: 'audio/wav'
    },
    {
      name: 'win',
      src: soundWin,
      type: 'audio/mpeg'
    }
  ]

  /**
   * @type {number}
   * @readonly
   */
  #volume = 0.4

  /**
   * @type {Component[]}
   */
  #players = []

  constructor() {
    super({
      name: 'sound',
      tagName: 'div',
      classList: ['d-none']
    })

    this.#initPlayers()
  }

  #initPlayers() {
    this.#sources.forEach(({ name, src, type }) =>
      this.#newPlayer({
        name,
        src,
        type
      })
    )
  }

  /**
   * @param {PlayerProps} props
   */
  #newPlayer({ name, src, type }) {
    const player = new Component({
      name: `player-${name}`,
      tagName: 'audio',
      $container: this.$element
    })

    /**
     * @type {HTMLAudioElement}
     */
    const $playerElement = player.$element

    $playerElement.volume = this.#volume

    const source = new Component({
      name: `source-${name}`,
      tagName: 'source',
      $container: $playerElement
    })

    /**
     * @type {HTMLSourceElement}
     */
    const $sourceElement = source.$element

    $sourceElement.type = type
    $sourceElement.src = src

    this.#players.push(player)
  }

  /**
   * @param {string} name
   * @returns {Promise<void>}
   */
  play(name) {
    const player = this.#players.find(
      ({ $element }) => $element.dataset.name === `player-${name}`
    )

    if (player === undefined) {
      throw new Error(`Unknown player name ${name}`)
    }

    /**
     * @type {HTMLAudioElement}
     */
    const $element = player.$element

    return $element.play()
  }
}
