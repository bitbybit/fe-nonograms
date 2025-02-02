import { BaseButton } from 'service/ui/button/BaseButton.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<BaseButtonProps>} RandomProps
 */

export class Random extends BaseButton {
  /**
   * @param {RandomProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'random',
      title: 'Random',
      classList: ['btn-primary', 'me-3'],
      $container
    })
  }
}
