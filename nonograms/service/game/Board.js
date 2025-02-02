import easyArrowUp from 'board/easy/arrow-up.json'
import easyCheckerboard from 'board/easy/checkerboard.json'
import easyCross from 'board/easy/cross.json'
import easySquare from 'board/easy/square.json'
import easyTriangle from 'board/easy/triangle.json'

import mediumConcentricSquares from 'board/medium/concentric-squares.json'
import mediumDiamond from 'board/medium/diamond.json'
import mediumHorizontalBars from 'board/medium/horizontal-bars.json'
import mediumLargeX from 'board/medium/large-x.json'
import mediumWindow from 'board/medium/window.json'

import hardBox from 'board/hard/box.json'
import hardFirTree from 'board/hard/fir-tree.json'
import hardHourglass from 'board/hard/hourglass.json'
import hardHouse from 'board/hard/house.json'
import hardStar from 'board/hard/star.json'

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
 * @typedef {
 *   'concentric-squares' |
 *   'diamond' |
 *   'horizontal-bars' |
 *   'large-x' |
 *   'window'
 * } BoardMediumName
 */

/**
 * @typedef {
 *   'box' |
 *   'fir-tree' |
 *   'hourglass' |
 *   'house' |
 *   'star'
 * } BoardHardName
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
  name

  /**
   * @param {BoardProps} props
   * @throws {Error}
   */
  constructor({ difficulty, name }) {
    this.#difficulty = difficulty
    this.name = name
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
    const name = this.name

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
    /**
     * @type {BoardMediumName}
     */
    const name = this.name

    switch (name) {
      case 'concentric-squares':
        return mediumConcentricSquares

      case 'diamond':
        return mediumDiamond

      case 'horizontal-bars':
        return mediumHorizontalBars

      case 'large-x':
        return mediumLargeX

      case 'window':
        return mediumWindow

      default:
        throw new Error(`Unknown board name ${name} (medium)`)
    }
  }

  /**
   * @returns {string}
   * @throws {Error}
   */
  get #hard() {
    /**
     * @type {BoardHardName}
     */
    const name = this.name

    switch (name) {
      case 'box':
        return hardBox

      case 'fir-tree':
        return hardFirTree

      case 'hourglass':
        return hardHourglass

      case 'house':
        return hardHouse

      case 'star':
        return hardStar

      default:
        throw new Error(`Unknown board name ${name} (hard)`)
    }
  }
}
