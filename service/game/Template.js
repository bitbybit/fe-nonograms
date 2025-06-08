import { Board } from 'service/game/Board.js'

/**
 * @typedef {{
 *   board: Board
 *   title: string
 * }} TemplateProps
 */

export class Template {
  /**
   * @type {string}
   */
  title

  /**
   * @type {Board}
   */
  board

  /**
   * @param {TemplateProps} props
   */
  constructor({ board, title }) {
    this.board = board
    this.title = title
  }

  /**
   * @param {string} row
   * @returns {Array<boolean>}
   */
  #rowToCells(row) {
    return row.split('').map(this.#cellToValue.bind(this))
  }

  /**
   * @param {string} cell
   * @returns {boolean}
   */
  #cellToValue(cell) {
    return cell !== ' '
  }

  /**
   * @returns {Array<string>}
   */
  get #rows() {
    return this.board.get().split('\n')
  }

  /**
   * @returns {StateCells}
   */
  get cells() {
    return this.#rows.map(this.#rowToCells.bind(this))
  }

  /**
   * @returns {number}
   */
  get horCellAmount() {
    return this.cells[0].length
  }

  /**
   * @returns {number}
   */
  get verCellAmount() {
    return this.cells.length
  }

  /**
   * @returns {Array<Array<number>>}
   */
  get horHints() {
    /**
     * @type {Array<Array<number>>}
     */
    const result = []

    for (let horIndex = 0; horIndex < this.horCellAmount; horIndex += 1) {
      result.push([])
      const lastResult = result[result.length - 1]

      for (let verIndex = 0; verIndex < this.verCellAmount; verIndex += 1) {
        const prev = this.cells?.[verIndex - 1]?.[horIndex] ?? false
        const cur = this.cells[verIndex][horIndex]

        if (cur) {
          if (prev) {
            lastResult[lastResult.length - 1] += 1
          } else {
            lastResult.push(1)
          }
        }
      }
    }

    return result
  }

  /**
   * @returns {Array<Array<number>>}
   */
  get verHints() {
    /**
     * @type {Array<Array<number>>}
     */
    const result = []

    for (let verIndex = 0; verIndex < this.verCellAmount; verIndex += 1) {
      result.push([])
      const lastResult = result[result.length - 1]

      for (let horIndex = 0; horIndex < this.horCellAmount; horIndex += 1) {
        const prev = this.cells[verIndex]?.[horIndex - 1] ?? false
        const cur = this.cells[verIndex][horIndex]

        if (cur) {
          if (prev) {
            lastResult[lastResult.length - 1] += 1
          } else {
            lastResult.push(1)
          }
        }
      }
    }

    return result
  }
}
