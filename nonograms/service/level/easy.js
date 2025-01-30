import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/Template.js'
import { Board } from 'service/Board.js'

export const easyLevel = new GameLevel({
  name: 'easy',
  title: 'Easy',
  templates: [
    new Template({
      title: 'Easy: Square',
      board: new Board({
        difficulty: 'easy',
        name: 'square'
      })
    }),
    new Template({
      title: 'Easy: Arrow',
      board: new Board({
        difficulty: 'easy',
        name: 'arrow-up'
      })
    }),
    new Template({
      title: 'Easy: Cross',
      board: new Board({
        difficulty: 'easy',
        name: 'cross'
      })
    }),
    new Template({
      title: 'Easy: Triangle',
      board: new Board({
        difficulty: 'easy',
        name: 'triangle'
      })
    }),
    new Template({
      title: 'Easy: Checkerboard',
      board: new Board({
        difficulty: 'easy',
        name: 'checkerboard'
      })
    })
  ]
})
