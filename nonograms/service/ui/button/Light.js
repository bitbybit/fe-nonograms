import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} LightProps
 */

export class Light extends BaseButton {
  /**
   * @param {LightProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'light',
      title: 'Switch to light theme',
      classList: ['btn-outline-light', 'd-none'],
      $container
    })
  }
}
