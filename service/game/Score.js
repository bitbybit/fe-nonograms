/**
 * @typedef {{
 *   name: Level['name']
 *   title: Level['title']
 * }} ScoreLevel
 */

/**
 * @typedef {{
 *   name: Board['name']
 *   title: Template['title']
 * }} ScoreTemplate
 */

/**
 * @typedef {{
 *   elapsedTime: number
 *   elapsedTimeFormatted: string
 *   level: ScoreLevel
 *   template: ScoreTemplate
 * }} ScoreRow
 */

export class Score {
  /**
   * @type {string}
   * @readonly
   */
  #storeName = 'scoreStore'

  /**
   * @type {string}
   * @readonly
   */
  #elapsedTimeIndexName = 'elapsedTimeIndex'

  /**
   * @type {number}
   * @readonly
   */
  #lastRowsAmount = 5

  /**
   * @type {IDBDatabase}
   */
  #db

  /**
   * @returns {Promise<IDBObjectStore>}
   */
  #connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('score', 1)

      request.addEventListener('error', (e) => {
        reject(`Error opening database: ${e.target.error}`)
      })

      request.addEventListener('upgradeneeded', (e) => {
        /**
         * @type {IDBDatabase}
         */
        const db = e.target.result

        const objectStore = db.createObjectStore(this.#storeName, {
          autoIncrement: true
        })

        objectStore.createIndex(this.#elapsedTimeIndexName, 'elapsedTime', {
          unique: false
        })
      })

      request.addEventListener('success', (e) => {
        this.#db = e.target.result

        const transaction = this.#db.transaction([this.#storeName], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(`Transaction error: ${e.target.error}`)
        })

        const objectStore = transaction.objectStore(this.#storeName)

        resolve(objectStore)
      })
    })
  }

  /**
   * @param {ScoreRow}
   * @returns {Promise<void>}
   */
  async addRow({ elapsedTime, elapsedTimeFormatted, level, template }) {
    const objectStore = await this.#connect()

    objectStore.add({ elapsedTime, elapsedTimeFormatted, level, template })

    this.#db.close()
  }

  /**
   * @returns {Promise<ScoreRow[]>}
   */
  async getLastRows() {
    const objectStore = await this.#connect()

    return new Promise((resolve, reject) => {
      const cursorRequest = objectStore.openCursor(null, 'prev')

      const rows = []

      cursorRequest.addEventListener('error', (e) => {
        this.#db.close()

        reject(`Error opening cursor: ${e.target.error}`)
      })

      cursorRequest.addEventListener('success', (e) => {
        /**
         * @type {IDBCursorWithValue | null}
         */
        const cursor = e.target.result

        if (cursor !== null) {
          rows.push(cursor.value)
          cursor.continue()
        } else {
          this.#db.close()

          const lastRows = rows.slice(0, this.#lastRowsAmount)

          lastRows.sort((a, b) => a.elapsedTime - b.elapsedTime)

          resolve(lastRows)
        }
      })
    })
  }
}
