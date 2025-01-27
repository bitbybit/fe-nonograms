/**
 * @typedef {{
 *   name: string
 *   templates: GameTemplate[]
 *   title: string
 * }} GameLevelProps
 */

export class GameLevel {
  /**
   * @type {string}
   */
  name

  /**
   * @type {string}
   */
  title

  /**
   * @type {GameTemplate[]}
   */
  templates

  /**
   * @param {GameLevelProps} props
   */
  constructor({ name, templates, title }) {
    this.name = name
    this.templates = templates
    this.title = title
  }
}
