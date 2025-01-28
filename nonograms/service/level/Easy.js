import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/Template.js'
import { Board } from 'service/Board.js'

export const Easy = new GameLevel({
  name: 'easy',
  title: 'Easy',
  templates: [
    new Template({
      board: new Board({
        difficulty: 'easy',
        name: 'square'
      })
    }),
    new Template({
      board: new Board({
        difficulty: 'easy',
        name: 'arrow-up'
      })
    }),
    new Template({
      board: new Board({
        difficulty: 'easy',
        name: 'cross'
      })
    }),
    new Template({
      board: new Board({
        difficulty: 'easy',
        name: 'triangle'
      })
    }),
    new Template({
      board: new Board({
        difficulty: 'easy',
        name: 'checkerboard'
      })
    })
  ]
})
