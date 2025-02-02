import { Button } from 'service/ui/Button.js'

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
      classList: ['btn-warning'],
      $container
    })
  }
}
