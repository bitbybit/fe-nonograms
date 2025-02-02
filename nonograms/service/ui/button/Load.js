import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} LoadProps
 */

export class Load extends BaseButton {
  /**
   * @param {LoadProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'load',
      title: 'Continue last game',
      classList: ['btn-success', 'd-none'],
      $container
    })
  }
}
