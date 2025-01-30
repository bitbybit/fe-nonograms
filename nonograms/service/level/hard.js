import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/Template.js'
import { Board } from 'service/Board.js'

export const hardLevel = new GameLevel({
  name: 'hard',
  title: 'Hard',
  templates: [
    new Template({
      title: 'Box',
      board: new Board({
        difficulty: 'hard',
        name: 'box'
      })
    }),
    new Template({
      title: 'Fir Tree',
      board: new Board({
        difficulty: 'hard',
        name: 'fir-tree'
      })
    }),
    new Template({
      title: 'Hourglass',
      board: new Board({
        difficulty: 'hard',
        name: 'hourglass'
      })
    }),
    new Template({
      title: 'House',
      board: new Board({
        difficulty: 'hard',
        name: 'house'
      })
    }),
    new Template({
      title: 'Star',
      board: new Board({
        difficulty: 'hard',
        name: 'star'
      })
    })
  ]
})
