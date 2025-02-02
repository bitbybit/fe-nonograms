import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} SaveProps
 */

export class Save extends BaseButton {
  /**
   * @param {SaveProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'save',
      title: 'Save game',
      classList: ['btn-warning'],
      $container
    })
  }
}
