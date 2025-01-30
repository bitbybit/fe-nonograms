import { Component } from 'service/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 *   levels: GameLevel[]
 * } & Partial<ComponentProps>} SelectorProps
 */

/**
 * @typedef {{
 *   detail: {
 *     level: GameLevel
 *     template: Template
 *   }
 * }} SelectorPayload
 */

export class Selector extends Component {
  /**
   * @type {GameLevel[]}
   */
  #levels

  /**
   * @param {SelectorProps} props
   */
  constructor({ $container, levels } = {}) {
    super({
      $container,
      name: 'selector',
      tagName: 'select',
      classList: ['form-select']
    })

    this.#levels = levels

    this.#initOptions()
    this.#initListener()
  }

  #initOptions() {
    this.#groups.forEach(({ title: groupTitle, options }, groupIndex) => {
      const optGroup = new Component({
        name: `selector-group-${groupIndex}`,
        tagName: 'optgroup',
        $container: this.$element
      })

      optGroup.$element.setAttribute('label', groupTitle)

      options.forEach(({ title: optionTitle, value }) => {
        const option = new Component({
          name: `selector-option-${value}`,
          tagName: 'option',
          $container: optGroup.$element
        })

        option.$element.setAttribute('value', value)
        option.$element.innerText = optionTitle
      })
    })
  }

  #initListener() {
    const boundListenChange = this.#listenChange.bind(this)

    this.$element.addEventListener('change', boundListenChange)
  }

  /**
   * @param {Event} e
   */
  #listenChange(e) {
    const level = this.#levels.find(({ templates }) =>
      templates.find(({ board }) => board.name === e.target.value)
    )

    if (level === undefined) {
      throw new Error(`No level found for option ${e.target.value}`)
    }

    const template = level.templates.find(
      ({ board }) => board.name === e.target.value
    )

    if (template === undefined) {
      throw new Error(`No template found for option ${e.target.value}`)
    }

    this.events.dispatchEvent(
      new CustomEvent('update', {
        detail: {
          level,
          template
        }
      })
    )
  }

  /**
   * @returns {Array<{
   *   title: string
   *   options: Array<{
   *     title: string
   *     value: string
   *   }>
   * }>}
   */
  get #groups() {
    return this.#levels.map(({ title: levelTitle, templates }) => ({
      title: levelTitle,

      options: templates.map(({ title: templateTitle, board }) => ({
        title: templateTitle,
        value: board.name
      }))
    }))
  }
}
