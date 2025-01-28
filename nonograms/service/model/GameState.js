/**
 * @typedef {{
 *   level: GameLevel
 * }} GameStateProps
 */

export class GameState {
  /**
   * @type {GameLevel}
   */
  level

  /**
   * @type {GameTemplate}
   */
  #template

  /**
   * @type {Array<Array<boolean>>}
   */
  cells

  /**
   * @param {GameStateProps} props
   */
  constructor({ level }) {
    this.level = level
    this.template = this.level.templates[0]
  }

  #initCells() {
    this.cells = new Array(this.template.verCellAmount).fill(
      new Array(this.template.horCellAmount).fill(false)
    )
  }

  /**
   * @returns {GameTemplate}
   */
  get template() {
    return this.#template
  }

  /**
   * @param {GameTemplate} template
   */
  set template(template) {
    this.#template = template

    this.#initCells()
  }

  /**
   * @returns {boolean}
   */
  get isBoardCompleted() {
    return this.template.cells.every((row, rowIndex) =>
      row.every(
        (cell, cellIndex) => this.cells?.[rowIndex]?.[cellIndex] === cell
      )
    )
  }
}
