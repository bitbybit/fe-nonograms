import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} DarkProps
 */

export class Dark extends BaseButton {
  /**
   * @param {DarkProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'dark',
      title: 'Switch to dark theme',
      classList: ['btn-outline-dark'],
      $container
    })
  }
}
