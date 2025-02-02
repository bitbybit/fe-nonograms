import { Component } from 'service/ui/Component.js'

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
 * }} CanvasDrawProps
 */

/**
 * @typedef {{
 *   detail: {
 *     x: number
 *     y: number
 *     value: boolean
 *   }
 * }} CanvasPayload
 */

export class Canvas extends Component {
  /**
   * @type {number}
   * @readonly
   */
  #cellBlockAmount = 5

  /**
   * @type {number}
   * @readonly
   */
  #cellPadding = 10

  /**
   * @type {number}
   * @readonly
   */
  #parentScale = 0.9

  /**
   * @type {number}
   * @readonly
   */
  #fontScale = 0.5

  /**
   * @type {number}
   * @readonly
   */
  #hintSpacingFactor = 1.4

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
   * @type {string}
   * @readonly
   */
  #colorBlank = '#ffffff'

  /**
   * @type {number}
   * @readonly
   */
  #lineWidth = 1

  /**
   * @type {number}
   * @readonly
   */
  #thickLineWidth = 3

  /**
   * @type {string}
   * @readonly
   */
  #cellKeyDelimiter = ','

  /**
   * @type {CanvasDrawProps['horCellAmount']}
   */
  #horCellAmount = 0

  /**
   * @type {CanvasDrawProps['horHints']}
   */
  #horHints = []

  /**
   * @type {CanvasDrawProps['verCellAmount']}
   */
  #verCellAmount = 0

  /**
   * @type {CanvasDrawProps['verHints']}
   */
  #verHints = []

  /**
   * @type {Set<string>}
   */
  #filledCells = new Set()

  /**
   * @type {Set<string>}
   */
  #placeholderCells = new Set()

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

    const boundHandleClick = this.#handleClick.bind(this)
    const boundHandleRightClick = this.#handleRightClick.bind(this)

    this.events.addEventListener('mount', () => {
      this.$element.addEventListener('click', boundHandleClick)
      this.$element.addEventListener('contextmenu', boundHandleRightClick)
    })

    this.events.addEventListener('unmount', () => {
      this.$element.removeEventListener('click', boundHandleClick)
      this.$element.removeEventListener('contextmenu', boundHandleRightClick)
    })
  }

  /**
   * @param {CanvasDrawProps} props
   */
  draw({ horCellAmount, horHints, verCellAmount, verHints }) {
    if (!this.#hasParent) {
      return
    }

    this.#horCellAmount = horCellAmount
    this.#horHints = horHints
    this.#verCellAmount = verCellAmount
    this.#verHints = verHints

    this.#setSize()
    this.#setFont()
    this.#drawHorGridLine()
    this.#drawVerGridLine()
    this.#highlightThickHorLines()
    this.#highlightThickVerLines()
    this.#drawHorHints()
    this.#drawVerHints()
    this.refillCells()
  }

  #drawHorGridLine() {
    for (let i = 0; i <= this.#verCellAmount; i += 1) {
      const y = this.#horHintPadding + i * this.#cellSize

      const shouldHintsBeDivided =
        i % this.#cellBlockAmount === 0 && i !== 0 && i !== this.#verCellAmount

      const x = shouldHintsBeDivided ? 0 : this.#verHintPadding

      this.#drawLine(x, y, this.#canvasWidth, y)
    }
  }

  #drawVerGridLine() {
    for (let i = 0; i <= this.#horCellAmount; i += 1) {
      const x = this.#verHintPadding + i * this.#cellSize

      const shouldHintsBeDivided =
        i % this.#cellBlockAmount === 0 && i !== 0 && i !== this.#horCellAmount

      const y = shouldHintsBeDivided ? 0 : this.#horHintPadding

      this.#drawLine(x, y, x, this.#canvasHeight)
    }
  }

  #drawHorHints() {
    const horHintsLength = this.#horHints.length

    for (let i = 0; i < horHintsLength; i += 1) {
      const x = this.#verHintPadding + i * this.#cellSize + this.#cellSize / 2

      const hints = this.#horHints[i]
      const hintsLength = hints.length

      for (let j = 0; j < hintsLength; j += 1) {
        const y =
          this.#horHintPadding -
          (hintsLength - j) * (this.#cellSize * this.#fontScale) -
          this.#cellPadding / 2

        this.#ctx2d.fillText(String(hints[j]), x, y)
      }
    }
  }

  #drawVerHints() {
    const verHintsLength = this.#verHints.length

    for (let i = 0; i < verHintsLength; i += 1) {
      const y = this.#horHintPadding + i * this.#cellSize + this.#cellSize / 2

      const hints = this.#verHints[i]
      const hintsLength = hints.length

      for (let j = 0; j < hintsLength; j += 1) {
        const x =
          this.#verHintPadding -
          (hintsLength - j) * (this.#cellSize * this.#fontScale) -
          this.#cellPadding / 2

        this.#ctx2d.fillText(String(hints[j]), x, y)
      }
    }
  }

  #highlightThickVerLines() {
    for (let i = 0; i <= this.#horCellAmount; i += 1) {
      if (i % this.#cellBlockAmount === 0) {
        const x = this.#verHintPadding + i * this.#cellSize

        this.#drawLine(
          x,
          this.#horHintPadding,
          x,
          this.#canvasHeight,
          this.#thickLineWidth
        )
      }
    }
  }

  #highlightThickHorLines() {
    for (let i = 0; i <= this.#verCellAmount; i += 1) {
      if (i % this.#cellBlockAmount === 0) {
        const y = this.#horHintPadding + i * this.#cellSize

        this.#drawLine(
          this.#verHintPadding,
          y,
          this.#canvasWidth,
          y,
          this.#thickLineWidth
        )
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
  #drawLine(x1, y1, x2, y2, width = this.#lineWidth) {
    this.#ctx2d.strokeStyle = this.#color
    this.#ctx2d.lineWidth = width

    this.#ctx2d.beginPath()

    this.#ctx2d.moveTo(x1, y1)
    this.#ctx2d.lineTo(x2, y2)

    this.#ctx2d.stroke()
  }

  /**
   * @param {PointerEvent} event
   */
  #handleClick(event) {
    const { isInCells, cellX, cellY } = this.#offsetToCell(event)

    if (isInCells) {
      this.#toggleCell(cellX, cellY)
      this.#dispatchUpdate(cellX, cellY)
    }
  }

  /**
   * @param {PointerEvent} event
   */
  #handleRightClick(event) {
    event.preventDefault()

    const { isInCells, cellX, cellY } = this.#offsetToCell(event)

    if (isInCells) {
      this.#toggleCellPlaceholder(cellX, cellY)
      this.#dispatchUpdate(cellX, cellY)
    }
  }

  /**
   * @param {PointerEvent} event
   * @returns {{
   *   cellX: number
   *   cellY: number
   *   isInCells: boolean
   * }}
   */
  #offsetToCell(event) {
    const x = event.offsetX
    const y = event.offsetY

    const isInGrid = x > this.#verHintPadding && y > this.#horHintPadding

    let isInCells = false

    let cellX = -1
    let cellY = -1

    if (isInGrid) {
      cellX = Math.floor((x - this.#verHintPadding) / this.#cellSize)
      cellY = Math.floor((y - this.#horHintPadding) / this.#cellSize)

      isInCells = cellX < this.#horCellAmount && cellY < this.#verCellAmount
    }

    return {
      cellX,
      cellY,
      isInCells
    }
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #dispatchUpdate(cellX, cellY) {
    this.events.dispatchEvent(
      new CustomEvent('update', {
        detail: {
          x: cellX,
          y: cellY,
          value: this.#getCellValue(cellX, cellY)
        }
      })
    )
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #getCellKey(cellX, cellY) {
    return `${cellX}${this.#cellKeyDelimiter}${cellY}`
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #getCellValue(cellX, cellY) {
    const key = this.#getCellKey(cellX, cellY)

    return this.#filledCells.has(key)
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #getCellPlaceholder(cellX, cellY) {
    const key = this.#getCellKey(cellX, cellY)

    return this.#placeholderCells.has(key)
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #toggleCell(cellX, cellY) {
    const isFilled = this.#getCellValue(cellX, cellY)

    if (isFilled) {
      this.#clearCell(cellX, cellY)

      this.events.dispatchEvent(new CustomEvent('clear'))
    } else {
      this.#fillCell(cellX, cellY)

      this.events.dispatchEvent(new CustomEvent('fill'))
    }
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #toggleCellPlaceholder(cellX, cellY) {
    const isPlaceholder = this.#getCellPlaceholder(cellX, cellY)

    if (isPlaceholder) {
      this.#clearCell(cellX, cellY)

      this.events.dispatchEvent(new CustomEvent('clear'))

      return
    }

    const isFilled = this.#getCellValue(cellX, cellY)

    if (isFilled) {
      this.#clearCell(cellX, cellY)
    }

    this.#setCellPlaceholder(cellX, cellY)

    this.events.dispatchEvent(new CustomEvent('placeholder'))
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #clearCell(cellX, cellY) {
    const x = this.#verHintPadding + cellX * this.#cellSize
    const y = this.#horHintPadding + cellY * this.#cellSize

    this.#ctx2d.fillStyle = this.#colorBlank

    this.#ctx2d.fillRect(
      x + this.#lineWidth,
      y + this.#lineWidth,
      this.#cellSize - this.#lineWidth * 2,
      this.#cellSize - this.#lineWidth * 2
    )

    this.#placeholderCells.delete(this.#getCellKey(cellX, cellY))
    this.#filledCells.delete(this.#getCellKey(cellX, cellY))
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #fillCell(cellX, cellY) {
    const x = this.#verHintPadding + cellX * this.#cellSize
    const y = this.#horHintPadding + cellY * this.#cellSize

    this.#ctx2d.fillStyle = this.#color

    this.#ctx2d.fillRect(
      x + this.#lineWidth,
      y + this.#lineWidth,
      this.#cellSize - this.#lineWidth * 2,
      this.#cellSize - this.#lineWidth * 2
    )

    this.#placeholderCells.delete(this.#getCellKey(cellX, cellY))
    this.#filledCells.add(this.#getCellKey(cellX, cellY))
  }

  /**
   * @param {number} cellX
   * @param {number} cellY
   */
  #setCellPlaceholder(cellX, cellY) {
    const x = this.#verHintPadding + cellX * this.#cellSize
    const y = this.#horHintPadding + cellY * this.#cellSize

    const centerX = x + this.#cellSize / 2
    const centerY = y + this.#cellSize / 2
    const halfSize = this.#cellSize / 4

    this.#ctx2d.strokeStyle = this.#color
    this.#ctx2d.lineWidth = this.#thickLineWidth

    this.#ctx2d.beginPath()
    this.#ctx2d.moveTo(centerX - halfSize, centerY - halfSize)
    this.#ctx2d.lineTo(centerX + halfSize, centerY + halfSize)
    this.#ctx2d.moveTo(centerX + halfSize, centerY - halfSize)
    this.#ctx2d.lineTo(centerX - halfSize, centerY + halfSize)
    this.#ctx2d.stroke()

    this.#filledCells.delete(this.#getCellKey(cellX, cellY))
    this.#placeholderCells.add(this.#getCellKey(cellX, cellY))
  }

  /**
   * @param {StateCells} cells
   */
  refillCells(cells = []) {
    if (cells.length > 0) {
      this.clearCells()

      for (let y = 0; y < cells.length; y += 1) {
        for (let x = 0; x < cells[y].length; x += 1) {
          if (cells[y][x]) {
            this.#filledCells.add(this.#getCellKey(x, y))
          }
        }
      }
    }

    this.#filledCells.forEach((cellKey) => {
      const [cellX, cellY] = cellKey.split(this.#cellKeyDelimiter).map(Number)

      this.#fillCell(cellX, cellY)
    })

    this.#placeholderCells.forEach((cellKey) => {
      const [cellX, cellY] = cellKey.split(this.#cellKeyDelimiter).map(Number)

      this.#setCellPlaceholder(cellX, cellY)
    })
  }

  clearCells() {
    const cellKeys = [...this.#filledCells, ...this.#placeholderCells]

    cellKeys.forEach((cellKey) => {
      const [cellX, cellY] = cellKey.split(this.#cellKeyDelimiter).map(Number)

      this.#clearCell(cellX, cellY)
    })
  }

  #setSize() {
    /**
     * @type {HTMLCanvasElement}
     */
    const $element = this.$element

    $element.width = this.#canvasWidth
    $element.height = this.#canvasHeight
  }

  #setFont() {
    this.#ctx2d.font = `${this.#cellSize * this.#fontScale}px ${this.#fontFamily}`
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
    return (this.#_$parent?.clientWidth ?? 0) * this.#parentScale
  }

  /**
   * @returns {number}
   */
  get #maxHorHints() {
    return Math.max(...this.#horHints.map((hints) => hints.length))
  }

  /**
   * @returns {number}
   */
  get #maxVerHints() {
    return Math.max(...this.#verHints.map((hints) => hints.length))
  }

  /**
   * @returns {number}
   */
  get #cellSize() {
    return this.#parentWidth / (this.#horCellAmount + this.#maxVerHints)
  }

  /**
   * @returns {number}
   */
  get #horHintPadding() {
    return (
      this.#maxHorHints *
        this.#cellSize *
        this.#fontScale *
        this.#hintSpacingFactor +
      this.#cellPadding
    )
  }

  /**
   * @returns {number}
   */
  get #verHintPadding() {
    return (
      this.#maxVerHints *
        this.#cellSize *
        this.#fontScale *
        this.#hintSpacingFactor +
      this.#cellPadding
    )
  }

  /**
   * @returns {number}
   */
  get #canvasWidth() {
    return this.#horCellAmount * this.#cellSize + this.#verHintPadding
  }

  /**
   * @returns {number}
   */
  get #canvasHeight() {
    return this.#verCellAmount * this.#cellSize + this.#horHintPadding
  }
}
