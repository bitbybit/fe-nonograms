import { Level } from 'service/game/Level.js'
import { Template } from 'service/game/Template.js'
import { Board } from 'service/game/Board.js'

export const mediumLevel = new Level({
  name: 'medium',
  title: 'Medium',
  templates: [
    new Template({
      title: 'Medium: Concentric Squares',
      board: new Board({
        difficulty: 'medium',
        name: 'concentric-squares'
      })
    }),
    new Template({
      title: 'Medium: Diamond',
      board: new Board({
        difficulty: 'medium',
        name: 'diamond'
      })
    }),
    new Template({
      title: 'Medium: Horizontal Bars',
      board: new Board({
        difficulty: 'medium',
        name: 'horizontal-bars'
      })
    }),
    new Template({
      title: 'Medium: Large X',
      board: new Board({
        difficulty: 'medium',
        name: 'large-x'
      })
    }),
    new Template({
      title: 'Medium: Window',
      board: new Board({
        difficulty: 'medium',
        name: 'window'
      })
    })
  ]
})
