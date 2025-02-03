/**
 * @typedef {{
 *   rows: ScoreRow[]
 * }} TableProps
 */

export class Table {
  /**
   * @type {HTMLTableElement}
   */
  $element

  /**
   * @param {TableProps} props
   */
  constructor({ rows }) {
    const $table = document.createElement('table')
    $table.classList.add('table', 'table-striped', 'table-hover')

    const $thead = document.createElement('thead')
    const $theadTr = document.createElement('tr')
    const $tbody = document.createElement('tbody')

    const titles = ['Level', 'Time']

    titles.forEach((title) => {
      const $th = document.createElement('th')
      $th.classList.add('text-center')
      $th.textContent = title

      $theadTr.appendChild($th)
    })

    $thead.appendChild($theadTr)

    rows.forEach(
      ({ elapsedTimeFormatted, template: { title: templateTitle } }) => {
        const $tbodyTr = document.createElement('tr')

        const values = [templateTitle, elapsedTimeFormatted]

        values.forEach((value) => {
          const $td = document.createElement('td')
          $td.classList.add('text-center')
          $td.textContent = value

          $tbodyTr.appendChild($td)
        })

        $tbody.appendChild($tbodyTr)
      }
    )

    $table.appendChild($thead)
    $table.appendChild($tbody)

    this.$element = $table
  }
}
