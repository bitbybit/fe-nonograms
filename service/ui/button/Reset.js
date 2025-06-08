import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} ResetProps
 */

export class Reset extends Button {
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
