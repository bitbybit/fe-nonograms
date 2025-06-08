import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} LightProps
 */

export class Light extends Button {
  /**
   * @param {LightProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'light',
      title: 'Dark ON',
      classList: ['btn-outline-light', 'd-none'],
      $container
    })
  }
}
