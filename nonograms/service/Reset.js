import { Component } from 'service/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ComponentProps>} ResetProps
 */

export class Reset extends Component {
  constructor({ $container } = {}) {
    super({
      $container,
      name: 'reset',
      tagName: 'button',
      classList: ['btn', 'btn-primary']
    })

    this.$element.innerText = 'Reset'

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
