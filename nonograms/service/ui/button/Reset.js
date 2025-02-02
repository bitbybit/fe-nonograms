import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} ResetProps
 */

export class Reset extends BaseButton {
  /**
   * @param {ResetProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'reset',
      title: 'Reset',
      classList: ['btn-primary'],
      $container
    })
  }
}
