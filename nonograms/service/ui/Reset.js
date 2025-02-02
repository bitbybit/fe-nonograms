import { Button } from 'service/ui/Button.js'

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
      $container
    })
  }
}
