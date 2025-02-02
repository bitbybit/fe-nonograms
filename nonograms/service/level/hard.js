import { GameLevel } from 'service/model/GameLevel.js'
import { Template } from 'service/game/Template.js'
import { Board } from 'service/game/Board.js'

export const hardLevel = new GameLevel({
  name: 'hard',
  title: 'Hard',
  templates: [
    new Template({
      title: 'Hard: Box',
      board: new Board({
        difficulty: 'hard',
        name: 'box'
      })
    }),
    new Template({
      title: 'Hard: Fir Tree',
      board: new Board({
        difficulty: 'hard',
        name: 'fir-tree'
      })
    }),
    new Template({
      title: 'Hard: Hourglass',
      board: new Board({
        difficulty: 'hard',
        name: 'hourglass'
      })
    }),
    new Template({
      title: 'Hard: House',
      board: new Board({
        difficulty: 'hard',
        name: 'house'
      })
    }),
    new Template({
      title: 'Hard: Star',
      board: new Board({
        difficulty: 'hard',
        name: 'star'
      })
    })
  ]
})
