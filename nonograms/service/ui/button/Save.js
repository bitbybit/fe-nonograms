import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} SaveProps
 */

export class Save extends Button {
  /**
   * @param {SaveProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'save',
      title: 'Save game',
      classList: ['btn-warning', 'me-3'],
      $container
    })
  }
}
