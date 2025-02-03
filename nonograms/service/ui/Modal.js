import { Component } from 'service/ui/Component.js'
import { Button } from 'service/ui/button/Button.js'

export class Modal extends Component {
  /**
   * @type {Component}
   */
  #backdrop

  /**
   * @type {Component}
   */
  #body

  constructor() {
    super({
      name: 'modal',
      classList: ['modal']
    })

    this.#initBackdrop()
    this.#initDialog()
  }

  #initBackdrop() {
    this.#backdrop = new Component({
      name: 'modal-backdrop',
      classList: ['modal-backdrop', 'fade', 'd-none']
    })
  }

  #initDialog() {
    const dialog = new Component({
      name: 'modal-dialog',
      classList: ['modal-dialog'],
      $container: this.$element
    })

    const content = new Component({
      name: 'modal-content',
      classList: ['modal-content'],
      $container: dialog.$element
    })

    this.#body = new Component({
      name: 'modal-body',
      classList: ['modal-body'],
      $container: content.$element
    })

    const footer = new Component({
      name: 'modal-footer',
      classList: ['modal-footer'],
      $container: content.$element
    })

    const closeButton = new Button({
      name: 'modal-close',
      title: 'Close',
      classList: ['btn-secondary'],
      $container: footer.$element
    })

    const boundHide = this.hide.bind(this)

    closeButton.events.addEventListener('click', boundHide)
  }

  /**
   * @param {HTMLElement|string} content
   */
  show(content) {
    const isText = typeof content === 'string'
    const isElement = content instanceof HTMLElement

    switch (true) {
      case isText:
        this.#body.$element.textContent = content
        break

      case isElement:
        this.#body.$element.appendChild(content)
        break

      default:
        throw new Error('Unsupported type of content')
    }

    this.#backdrop.$element.classList.remove('d-none')
    this.#backdrop.$element.classList.add('show')

    this.$element.classList.add('d-block')
  }

  hide() {
    this.$element.classList.remove('d-block')

    this.#backdrop.$element.classList.remove('show')
    this.#backdrop.$element.classList.add('d-none')

    this.#body.$element.replaceChildren()
  }
}
