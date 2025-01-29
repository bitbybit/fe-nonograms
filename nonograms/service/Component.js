/**
 * @typedef {{
 *   $container: HTMLElement | undefined
 *   classList: string[] | undefined
 *   name: string
 *   tagName: string | undefined
 * }} ComponentProps
 */

export class Component {
  /**
   * @type {HTMLElement}
   */
  $element

  /**
   * @type {EventTarget}
   */
  events = new EventTarget()

  /**
   * @param {ComponentProps} props
   */
  constructor({
    $container = document.body,
    classList = [],
    name,
    tagName = 'div'
  } = {}) {
    if (name === undefined) {
      throw new Error('Component name is required')
    }

    const $existedElement = $container.querySelector(`[data-name=${name}]`)

    if ($container.contains($existedElement)) {
      requestAnimationFrame(() =>
        this.events.dispatchEvent(
          new CustomEvent('unmount', {
            detail: { $element: this.$element }
          })
        )
      )

      $existedElement.replaceChildren()
      $container.removeChild($existedElement)
    }

    this.$element = document.createElement(tagName)
    this.$element.classList.add(...classList)
    this.$element.dataset.name = name

    $container.appendChild(this.$element)

    requestAnimationFrame(() =>
      this.events.dispatchEvent(
        new CustomEvent('mount', {
          detail: { $element: this.$element }
        })
      )
    )
  }
}
