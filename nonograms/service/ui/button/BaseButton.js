import { Component } from 'service/ui/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 *   name: string
 *   title: string
 * } & Partial<ComponentProps>} BaseButtonProps
 */

export class BaseButton extends Component {
  /**
   * @param {BaseButtonProps} props
   */
  constructor({ $container, classList = [], name, title } = {}) {
    super({
      name,
      tagName: 'button',
      classList: ['btn', ...classList],
      $container
    })

    this.$element.innerText = title

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
