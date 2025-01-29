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
   * @type {Template}
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
    this.cells = Array.from({ length: this.template.verCellAmount }, () =>
      new Array(this.template.horCellAmount).fill(false)
    )
  }

  /**
   * @returns {Template}
   */
  get template() {
    return this.#template
  }

  /**
   * @param {Template} template
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
