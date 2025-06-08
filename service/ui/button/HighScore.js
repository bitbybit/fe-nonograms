import { Button } from 'service/ui/button/Button.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ButtonProps>} HighScoreProps
 */

export class HighScore extends Button {
  /**
   * @param {HighScoreProps} props
   */
  constructor({ $container } = {}) {
    super({
      name: 'high-score',
      title: 'Score',
      classList: ['btn-primary'],
      $container
    })
  }
}
