import { Component } from 'service/ui/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 *   levels: Level[]
 * } & Partial<ComponentProps>} SelectorProps
 */

/**
 * @typedef {{
 *   detail: {
 *     level: Level
 *     template: Template
 *   }
 * }} SelectorPayload
 */

export class Selector extends Component {
  /**
   * @type {Level[]}
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
        option.$element.textContent = optionTitle
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
    this.#dispatchUpdate(e.target.value)
  }

  /**
   * @param {Template} template
   * @throws {Error}
   */
  select(template) {
    /**
     * @type {HTMLSelectElement}
     */
    const $element = this.$element

    const optionIndex = Array.from($element.options).findIndex(
      ({ value }) => value === template.board.name
    )

    const hasOption = optionIndex !== -1

    if (!hasOption) {
      throw new Error(
        `No option found for template board ${template.board.name}`
      )
    }

    $element.selectedIndex = optionIndex
  }

  selectRandom() {
    /**
     * @type {HTMLSelectElement}
     */
    const $element = this.$element

    $element.selectedIndex = Math.floor(
      Math.random() * ($element.options.length - 1)
    )

    this.#dispatchUpdate($element.value)
  }

  /**
   * @param {string} value
   */
  #dispatchUpdate(value) {
    const level = this.#levels.find(({ templates }) =>
      templates.find(({ board }) => board.name === value)
    )

    if (level === undefined) {
      throw new Error(`No level found for option ${value}`)
    }

    const template = level.templates.find(({ board }) => board.name === value)

    if (template === undefined) {
      throw new Error(`No template found for option ${value}`)
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
