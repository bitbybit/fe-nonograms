import { Button } from 'service/ui/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} LoadProps
 */

export class Load extends Button {
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
