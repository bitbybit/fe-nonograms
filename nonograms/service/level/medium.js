import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/Template.js'
import { Board } from 'service/Board.js'

export const mediumLevel = new GameLevel({
  name: 'medium',
  title: 'Medium',
  templates: [
    new Template({
      title: 'Concentric Squares',
      board: new Board({
        difficulty: 'medium',
        name: 'concentric-squares'
      })
    }),
    new Template({
      title: 'Diamond',
      board: new Board({
        difficulty: 'medium',
        name: 'diamond'
      })
    }),
    new Template({
      title: 'Horizontal Bars',
      board: new Board({
        difficulty: 'medium',
        name: 'horizontal-bars'
      })
    }),
    new Template({
      title: 'Large X',
      board: new Board({
        difficulty: 'medium',
        name: 'large-x'
      })
    }),
    new Template({
      title: 'Window',
      board: new Board({
        difficulty: 'medium',
        name: 'window'
      })
    })
  ]
})
