/**
 * @typedef {{
 *   $container: HTMLElement | undefined
 *   classList: string[] | undefined
 *   name: string
 *   onMount: (($element: HTMLElement) => {}) | undefined
 *   onUnmount: (($element: HTMLElement) => {}) | undefined
 *   tagName: string | undefined
 * }} ComponentProps
 */

export class Component {
  /**
   * @type {HTMLElement}
   */
  $element

  /**
   * @param {ComponentProps} props
   */
  constructor({
    $container = document.body,
    classList = [],
    name,
    onMount = () => {},
    onUnmount = () => {},
    tagName = 'div'
  } = {}) {
    if (name === undefined) {
      throw new Error('Component name is required')
    }

    const $existedElement = $container.querySelector(`[data-name=${name}]`)

    if ($container.contains($existedElement)) {
      onUnmount($existedElement)

      $existedElement.replaceChildren()
      $container.removeChild($existedElement)
    }

    this.$element = document.createElement(tagName)
    this.$element.classList.add(...classList)
    this.$element.dataset.name = name

    $container.appendChild(this.$element)

    onMount(this.$element)
  }
}
