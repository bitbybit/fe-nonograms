/**
 * @typedef {{
 *   name: string
 *   templates: Template[]
 *   title: string
 * }} LevelProps
 */

export class Level {
  /**
   * @type {string}
   */
  name

  /**
   * @type {string}
   */
  title

  /**
   * @type {Template[]}
   */
  templates

  /**
   * @param {LevelProps} props
   */
  constructor({ name, templates, title }) {
    this.name = name
    this.templates = templates
    this.title = title
  }
}
