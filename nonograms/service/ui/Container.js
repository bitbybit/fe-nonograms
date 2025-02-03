import { Component } from 'service/ui/Component.js'

export class Container extends Component {
  /**
   * @type {Component}
   */
  selector

  /**
   * @type {Component}
   */
  controlsHeader

  /**
   * @type {Component}
   */
  controlsFooter

  /**
   * @type {Component}
   */
  stopwatch

  /**
   * @type {Component}
   */
  canvas

  /**
   * @type {Component}
   */
  theme

  constructor() {
    super({
      name: 'container',
      classList: ['container', 'd-flex', 'flex-column']
    })

    const rows = new Component({
      name: 'rows',
      classList: ['row', 'flex-grow-1'],
      $container: this.$element
    })

    this.selector = new Component({
      name: 'selector-wrapper',
      classList: [
        'col-4',
        'p-2',
        'align-content-center',
        'mb-auto',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })

    this.controlsHeader = new Component({
      name: 'controls-header-wrapper',
      classList: [
        'col-6',
        'p-2',
        'align-content-center',
        'mb-auto',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })

    this.stopwatch = new Component({
      name: 'stopwatch-wrapper',
      classList: [
        'col-2',
        'p-2',
        'align-content-center',
        'mb-auto',
        'text-center',
        'bg-secondary-subtle',
        'text-primary'
      ],
      $container: rows.$element
    })

    this.canvas = new Component({
      name: 'canvas-wrapper',
      classList: [
        'col-12',
        'p-2',
        'd-flex',
        'flex-grow-1',
        'align-items-center',
        'justify-content-center',
        'mt-auto',
        'mb-auto'
      ],
      $container: rows.$element
    })

    this.controlsFooter = new Component({
      name: 'controls-footer-wrapper',
      classList: [
        'col-8',
        'p-2',
        'align-content-center',
        'mt-auto',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })

    this.theme = new Component({
      name: 'theme-wrapper',
      classList: [
        'col-4',
        'p-2',
        'align-content-center',
        'text-end',
        'mt-auto',
        'bg-secondary-subtle'
      ],
      $container: rows.$element
    })
  }
}
