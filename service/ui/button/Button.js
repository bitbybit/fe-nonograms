import { Component } from 'service/ui/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 *   name: string
 *   title: string
 * } & Partial<ComponentProps>} ButtonProps
 */

export class Button extends Component {
  /**
   * @param {ButtonProps} props
   */
  constructor({ $container, classList = [], name, title } = {}) {
    super({
      name,
      tagName: 'button',
      classList: ['btn', ...classList],
      $container
    })

    this.$element.textContent = title

    this.#initListener()
  }

  #initListener() {
    const boundListenClick = this.#listenClick.bind(this)

    this.$element.addEventListener('click', boundListenClick)
  }

  #listenClick() {
    this.events.dispatchEvent(new CustomEvent('click'))
  }
}
