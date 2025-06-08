/**
 * @typedef {{
 *   levels: Level[]
 * }} StateProps
 */

/**
 * @typedef {boolean} StateCellValue
 */

/**
 * @typedef {StateCellValue[]} StateCellRow
 */

/**
 * @typedef {StateCellRow[]} StateCells
 */

export class State {
  /**
   * @type {string}
   * @readonly
   */
  #localStorageKey = 'state'

  /**
   * @type {Level[]}
   * @readonly
   */
  levels

  /**
   * @type {Level}
   */
  level

  /**
   * @type {Template}
   */
  #template

  /**
   * @type {StateCells}
   */
  cells

  /**
   * @type {number}
   */
  elapsedTime = 0

  /**
   * @param {StateProps} props
   */
  constructor({ levels }) {
    this.levels = levels
    this.level = this.levels[0]
    this.template = this.level.templates[0]
  }

  initDefaultCells() {
    this.cells = Array.from({ length: this.template.verCellAmount }, () =>
      new Array(this.template.horCellAmount).fill(false)
    )
  }

  save() {
    window.localStorage.setItem(this.#localStorageKey, this.#rawCurrentState)
  }

  /**
   * @throws {Error}
   */
  load() {
    try {
      if (!this.hasSavedState) {
        throw new Error('No saved state found')
      }

      this.level = this.#parsedSavedLevel
      this.#template = this.#parsedSavedTemplate
      this.cells = this.#parsedSavedCells
      this.elapsedTime = this.#parsedSavedElapsedTime
    } finally {
      this.#removeSaved()
    }
  }

  #removeSaved() {
    window.localStorage.removeItem(this.#localStorageKey)
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

    this.initDefaultCells()
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

  /**
   * @returns {string}
   */
  get #rawCurrentState() {
    return JSON.stringify({
      cells: this.cells,
      elapsedTime: this.elapsedTime,
      level: this.level,
      template: this.template
    })
  }

  /**
   * @returns {string|null}
   */
  get #rawSavedState() {
    return window.localStorage.getItem(this.#localStorageKey)
  }

  /**
   * @returns {{
   *  cells: StateCells | undefined
   *  elapsedTime: number | undefined
   *  level: Level | undefined
   *  template: Template | undefined
   * }}
   */
  get #parsedSavedState() {
    return JSON.parse(this.#rawSavedState)
  }

  /**
   * @returns {number}
   * @throws {Error}
   */
  get #parsedSavedElapsedTime() {
    const elapsedTime = this.#parsedSavedState?.elapsedTime

    if (elapsedTime === undefined) {
      throw new Error(
        `Saved time is invalid (${JSON.stringify(this.#parsedSavedState?.elapsedTime)})`
      )
    }

    return elapsedTime
  }

  /**
   * @returns {Level}
   * @throws {Error}
   */
  get #parsedSavedLevel() {
    const level = this.levels.find(
      ({ name }) => name === (this.#parsedSavedState?.level?.name ?? '')
    )

    if (level === undefined) {
      throw new Error(
        `Saved level is invalid (${JSON.stringify(this.#parsedSavedState?.level)})`
      )
    }

    return level
  }

  /**
   * @returns {Template}
   * @throws {Error}
   */
  get #parsedSavedTemplate() {
    const template = this.level.templates.find(
      ({ board }) =>
        board.name === (this.#parsedSavedState?.template?.board?.name ?? '')
    )

    if (template === undefined) {
      throw new Error(
        `Saved template is invalid (${JSON.stringify(this.#parsedSavedState?.template)})`
      )
    }

    return template
  }

  /**
   * @returns {StateCells}
   * @throws {Error}
   */
  get #parsedSavedCells() {
    const cells = this.#parsedSavedState?.cells ?? []

    const isValidVertically = cells.length === this.template.verCellAmount

    const isValidHorizontally = cells.every(
      (row) =>
        row.length === this.template.horCellAmount &&
        row.every((cell) => typeof cell === 'boolean')
    )

    if (!isValidVertically || !isValidHorizontally) {
      throw new Error(
        `Saved cells are invalid (${JSON.stringify(this.#parsedSavedState?.cells)})`
      )
    }

    return cells
  }

  /**
   * @returns {boolean}
   */
  get hasSavedState() {
    const hasRaw = this.#rawSavedState !== '' && this.#rawSavedState !== null

    const hasCells = this.#parsedSavedState?.cells !== undefined
    const hasElapsedTime = this.#parsedSavedState?.elapsedTime !== undefined
    const hasLevel = this.#parsedSavedState?.level !== undefined
    const hasTemplate = this.#parsedSavedState?.template !== undefined

    return hasRaw && hasCells && hasElapsedTime && hasLevel && hasTemplate
  }
}
