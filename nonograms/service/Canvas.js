import { Component } from 'service/Component.js'

/**
 * @typedef {{
 *   $container: HTMLElement
 * } & Partial<ComponentProps>} CanvasProps
 */

/**
 * @typedef {{
 *   horCellAmount: number
 *   horHints: Array<Array<number>>
 *   verCellAmount: number
 *   verHints: Array<Array<number>>
 * }} CanvasInitProps
 */

export class Canvas extends Component {
  /**
   * @type {number}
   * @readonly
   */
  #cellPadding = 10

  /**
   * @type {number}
   * @readonly
   */
  #fontScale = 0.5

  /**
   * @type {number}
   * @readonly
   */
  #hintSpacingFactor = 1.2

  /**
   * @type {string}
   * @readonly
   */
  #fontFamily = 'Arial'

  /**
   * @type {string}
   * @readonly
   */
  #color = '#000000'

  /**
   * @type {number}
   * @readonly
   */
  #thickLineWidth = 3

  /**
   * @param {CanvasProps} props
   */
  constructor({ $container, ...componentProps } = {}) {
    if (!($container instanceof HTMLElement)) {
      throw new Error('Canvas container is required')
    }

    super({
      ...componentProps,
      $container,
      name: 'canvas',
      tagName: 'canvas'
    })

    this.events.addEventListener('mount', () => {
      console.log('On canvas mount')
    })

    this.events.addEventListener('unmount', () => {
      console.log('On canvas unmount')
    })
  }

  /**
   * @param {CanvasInitProps} props
   */
  draw({ horCellAmount, horHints, verCellAmount, verHints }) {
    if (!this.#hasParent) {
      return
    }

    const maxHorHints = this.#getMaxHorHints(horHints)
    const maxVerHints = this.#getMaxVerHints(verHints)
    const cellSize = this.#getCellSize(horCellAmount, maxVerHints)
    const horHintPadding = this.#getHorHintPadding(maxHorHints, cellSize)
    const verHintPadding = this.#getVerHintPadding(maxVerHints, cellSize)

    const canvasWidth = this.#getCanvasWidth(
      horCellAmount,
      cellSize,
      verHintPadding
    )

    const canvasHeight = this.#getCanvasHeight(
      verCellAmount,
      cellSize,
      horHintPadding
    )

    this.#setSize(canvasWidth, canvasHeight)
    this.#setFont(cellSize)

    this.#drawHorGridLine(
      verCellAmount,
      horHintPadding,
      cellSize,
      verHintPadding,
      canvasWidth
    )

    this.#drawVerGridLine(
      horCellAmount,
      verHintPadding,
      cellSize,
      horHintPadding,
      canvasHeight
    )

    this.#highlightThickHorLines(
      verCellAmount,
      horHintPadding,
      cellSize,
      verHintPadding,
      canvasWidth
    )

    this.#highlightThickVerLines(
      horCellAmount,
      verHintPadding,
      cellSize,
      horHintPadding,
      canvasHeight
    )

    this.#drawHorHints(horHints, verHintPadding, cellSize, horHintPadding)
    this.#drawVerHints(verHints, horHintPadding, cellSize, verHintPadding)
  }

  /**
   * @param {CanvasInitProps['horCellAmount']} horCellAmount
   * @param {number} verHintPadding
   * @param {number} cellSize
   * @param {number} horHintPadding
   * @param {number} canvasHeight
   */
  #drawVerGridLine(
    horCellAmount,
    verHintPadding,
    cellSize,
    horHintPadding,
    canvasHeight
  ) {
    for (let i = 0; i <= horCellAmount; i += 1) {
      const x = verHintPadding + i * cellSize

      this.#drawLine(x, horHintPadding, x, canvasHeight)
    }
  }

  /**
   * @param {CanvasInitProps['verCellAmount']} verCellAmount
   * @param {number} horHintPadding
   * @param {number} cellSize
   * @param {number} verHintPadding
   * @param {number} canvasWidth
   */
  #drawHorGridLine(
    verCellAmount,
    horHintPadding,
    cellSize,
    verHintPadding,
    canvasWidth
  ) {
    for (let i = 0; i <= verCellAmount; i += 1) {
      const y = horHintPadding + i * cellSize

      this.#drawLine(verHintPadding, y, canvasWidth, y)
    }
  }

  /**
   * @param {CanvasInitProps['horHints']} horHints
   * @param {number} verHintPadding
   * @param {number} cellSize
   * @param {number} horHintPadding
   */
  #drawHorHints(horHints, verHintPadding, cellSize, horHintPadding) {
    const horHintsLength = horHints.length

    for (let i = 0; i < horHintsLength; i += 1) {
      const x = verHintPadding + i * cellSize + cellSize / 2

      const hints = horHints[i]
      const hintsLength = hints.length

      for (let j = 0; j < hintsLength; j += 1) {
        const y =
          horHintPadding -
          (hintsLength - j) * (cellSize * this.#fontScale) -
          this.#cellPadding / 2

        this.#ctx2d.fillText(String(hints[j]), x, y)
      }
    }
  }

  /**
   * @param {CanvasInitProps['verHints']} verHints
   * @param {number} horHintPadding
   * @param {number} cellSize
   * @param {number} verHintPadding
   */
  #drawVerHints(verHints, horHintPadding, cellSize, verHintPadding) {
    const verHintsLength = verHints.length

    for (let i = 0; i < verHintsLength; i += 1) {
      const y = horHintPadding + i * cellSize + cellSize / 2

      const hints = verHints[i]
      const hintsLength = hints.length

      for (let j = 0; j < hintsLength; j += 1) {
        const x =
          verHintPadding -
          (hintsLength - j) * (cellSize * this.#fontScale) -
          this.#cellPadding / 2

        this.#ctx2d.fillText(String(hints[j]), x, y)
      }
    }
  }

  /**
   * @param {CanvasInitProps['horCellAmount']} horCellAmount
   * @param {number} verHintPadding
   * @param {number} cellSize
   * @param {number} horHintPadding
   * @param {number} canvasHeight
   */
  #highlightThickVerLines(
    horCellAmount,
    verHintPadding,
    cellSize,
    horHintPadding,
    canvasHeight
  ) {
    for (let i = 0; i <= horCellAmount; i += 1) {
      if (i % 5 === 0) {
        const x = verHintPadding + i * cellSize

        this.#drawLine(x, horHintPadding, x, canvasHeight, this.#thickLineWidth)
      }
    }
  }

  /**
   * @param {CanvasInitProps['verCellAmount']} verCellAmount
   * @param {number} horHintPadding
   * @param {number} cellSize
   * @param {number} verHintPadding
   * @param {number} canvasWidth
   */
  #highlightThickHorLines(
    verCellAmount,
    horHintPadding,
    cellSize,
    verHintPadding,
    canvasWidth
  ) {
    for (let i = 0; i <= verCellAmount; i += 1) {
      if (i % 5 === 0) {
        const y = horHintPadding + i * cellSize

        this.#drawLine(verHintPadding, y, canvasWidth, y, this.#thickLineWidth)
      }
    }
  }

  /**
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} width
   */
  #drawLine(x1, y1, x2, y2, width = 1) {
    this.#ctx2d.strokeStyle = this.#color
    this.#ctx2d.lineWidth = width

    this.#ctx2d.beginPath()

    this.#ctx2d.moveTo(x1, y1)
    this.#ctx2d.lineTo(x2, y2)

    this.#ctx2d.stroke()
  }

  /**
   * @param {CanvasInitProps['horHints']} horHints
   * @returns {number}
   */
  #getMaxHorHints(horHints) {
    return Math.max(...horHints.map((hints) => hints.length))
  }

  /**
   * @param {CanvasInitProps['verHints']} verHints
   * @returns {number}
   */
  #getMaxVerHints(verHints) {
    return Math.max(...verHints.map((hints) => hints.length))
  }

  /**
   * @param {CanvasInitProps['horCellAmount']} horCellAmount
   * @param {number} maxVerHints
   * @returns {number}
   */
  #getCellSize(horCellAmount, maxVerHints) {
    return this.#parentWidth / (horCellAmount + maxVerHints)
  }

  /**
   * @param {number} maxHorHints
   * @param {number} cellSize
   * @returns {number}
   */
  #getHorHintPadding(maxHorHints, cellSize) {
    return (
      maxHorHints * cellSize * this.#fontScale * this.#hintSpacingFactor +
      this.#cellPadding
    )
  }

  /**
   * @param {number} maxVerHints
   * @param {number} cellSize
   * @returns {number}
   */
  #getVerHintPadding(maxVerHints, cellSize) {
    return (
      maxVerHints * cellSize * this.#fontScale * this.#hintSpacingFactor +
      this.#cellPadding
    )
  }

  /**
   * @param {CanvasInitProps['horCellAmount']} horCellAmount
   * @param {number} cellSize
   * @param {number} verHintPadding
   * @returns {number}
   */
  #getCanvasWidth(horCellAmount, cellSize, verHintPadding) {
    return horCellAmount * cellSize + verHintPadding
  }

  /**
   * @param {CanvasInitProps['verCellAmount']} verCellAmount
   * @param {number} cellSize
   * @param {number} horHintPadding
   * @returns {number}
   */
  #getCanvasHeight(verCellAmount, cellSize, horHintPadding) {
    return verCellAmount * cellSize + horHintPadding
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  #setSize(width, height) {
    /**
     * @type {HTMLCanvasElement}
     */
    const $element = this.$element

    $element.width = width
    $element.height = height
  }

  #setFont(cellSize) {
    this.#ctx2d.font = `${cellSize * this.#fontScale}px ${this.#fontFamily}`
    this.#ctx2d.textAlign = 'center'
    this.#ctx2d.textBaseline = 'middle'
  }

  /**
   * @returns {CanvasRenderingContext2D}
   */
  get #ctx2d() {
    /**
     * @type {HTMLCanvasElement}
     */
    const $element = this.$element

    return $element.getContext('2d')
  }

  /**
   * @returns {boolean}
   */
  get #hasParent() {
    return this.#_$parent !== null
  }

  /**
   * @returns {HTMLElement|null}
   */
  get #_$parent() {
    return this.$element.parentElement
  }

  /**
   * @returns {number}
   */
  get #parentWidth() {
    return this.#_$parent?.clientWidth ?? 0
  }
}
