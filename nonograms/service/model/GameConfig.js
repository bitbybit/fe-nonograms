/**
 * @typedef {{
 *   levels: GameLevel[]
 * }} GameConfigProps
 */

export class GameConfig {
  /**
   * @type {GameLevel[]}
   */
  levels

  /**
   * @param {GameConfigProps} props
   */
  constructor({ levels }) {
    this.levels = levels
  }
}
