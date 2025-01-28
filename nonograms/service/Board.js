import easyArrowUp from 'board/easy/arrow-up.json'
import easyCheckerboard from 'board/easy/checkerboard.json'
import easyCross from 'board/easy/cross.json'
import easySquare from 'board/easy/square.json'
import easyTriangle from 'board/easy/triangle.json'

/**
 * @typedef {
 *   'arrow-up' |
 *   'checkerboard' |
 *   'cross' |
 *   'square' |
 *   'triangle'
 * } BoardEasyName
 */

/**
 * @typedef {string} BoardMediumName
 */

/**
 * @typedef {string} BoardHardName
 */

/**
 * @typedef {BoardEasyName | BoardMediumName | BoardHardName} BoardName
 */

/**
 * @typedef {'easy' | 'medium' | 'hard'} BoardDifficulty
 */

/**
 * @typedef {{
 *   difficulty: BoardDifficulty
 *   name: BoardName
 * }} BoardProps
 */

export class Board {
  /**
   * @type {BoardDifficulty}
   */
  #difficulty

  /**
   * @type {BoardName}
   */
  #name

  /**
   * @param {BoardProps} props
   * @throws {Error}
   */
  constructor({ difficulty, name }) {
    this.#difficulty = difficulty
    this.#name = name
  }

  /**
   * @returns {string}
   */
  get() {
    switch (this.#difficulty) {
      case 'easy':
        return this.#easy

      case 'medium':
        return this.#medium

      case 'hard':
        return this.#hard

      default:
        throw new Error(`Unknown board difficulty ${this.#difficulty}`)
    }
  }

  /**
   * @returns {string}
   * @throws {Error}
   */
  get #easy() {
    /**
     * @type {BoardEasyName}
     */
    const name = this.#name

    switch (name) {
      case 'arrow-up':
        return easyArrowUp

      case 'checkerboard':
        return easyCheckerboard

      case 'cross':
        return easyCross

      case 'square':
        return easySquare

      case 'triangle':
        return easyTriangle

      default:
        throw new Error(`Unknown board name ${name} (easy)`)
    }
  }

  /**
   * @returns {string}
   * @throws {Error}
   */
  get #medium() {
    throw new Error(`Unknown board name ${this.#name} (medium)`)
  }

  /**
   * @returns {string}
   * @throws {Error}
   */
  get #hard() {
    throw new Error(`Unknown board name ${this.#name} (hard)`)
  }
}
