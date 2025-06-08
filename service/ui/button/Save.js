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
      title: 'Save',
      classList: ['btn-warning', 'me-2'],
      $container
    })
  }
}
