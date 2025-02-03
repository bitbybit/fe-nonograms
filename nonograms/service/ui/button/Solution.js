import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} SolutionProps
 */

export class Solution extends Button {
  /**
   * @param {SolutionProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'solution',
      title: 'Solution',
      classList: ['btn-primary'],
      $container
    })
  }
}
