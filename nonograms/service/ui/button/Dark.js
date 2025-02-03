import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} DarkProps
 */

export class Dark extends Button {
  /**
   * @param {DarkProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'dark',
      title: 'Dark OFF',
      classList: ['btn-outline-dark'],
      $container
    })
  }
}
