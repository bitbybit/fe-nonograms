import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/Template.js'
import { Board } from 'service/Board.js'

export const easyLevel = new GameLevel({
  name: 'easy',
  title: 'Easy',
  templates: [
    new Template({
      title: 'Square',
      board: new Board({
        difficulty: 'easy',
        name: 'square'
      })
    }),
    new Template({
      title: 'Arrow',
      board: new Board({
        difficulty: 'easy',
        name: 'arrow-up'
      })
    }),
    new Template({
      title: 'Cross',
      board: new Board({
        difficulty: 'easy',
        name: 'cross'
      })
    }),
    new Template({
      title: 'Triangle',
      board: new Board({
        difficulty: 'easy',
        name: 'triangle'
      })
    }),
    new Template({
      title: 'Checkerboard',
      board: new Board({
        difficulty: 'easy',
        name: 'checkerboard'
      })
    })
  ]
})
