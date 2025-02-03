import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} RandomProps
 */

export class Random extends Button {
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
