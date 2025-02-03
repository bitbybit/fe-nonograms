import { Button } from 'service/ui/button/Button.js'

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
      title: 'Load',
      classList: ['btn-success', 'me-3', 'd-none'],
      $container
    })
  }
}
