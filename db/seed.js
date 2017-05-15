'use strict'

const db = require('APP/db')
    , {User, Story, Scene, Actor, ScenesActors, ScenesMaps, Map, Promise} = db
    , {mapValues} = require('lodash')

function seedEverything() {
  const seeded = {
    users: users(),
    actors: actors(),
    maps: maps(),
  }
  seeded.stories = stories(seeded)
  seeded.scenes = scenes(seeded)
  seeded.scenesActors = scenesActors(seeded)
  seeded.scenesMaps = scenesMaps(seeded)

  return Promise.props(seeded)
}

const users = seed(User, {
  omri: {
    username: 'omri',
    display_name: 'Omri B',
    email: 'omri@omri.omri',
    password: '123',
  },
  jacob: {
    username: 'jake',
    display_name: 'Jacob K',
    email: 'jacob@omri.omri',
    password: '123',
  }
})

const stories = seed(Story,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({users}) => ({
    story1: {
      id: 1,
      title: `James Comey's Conspicuous Independence`,
      user_id: users.jacob.id
    },
  })
)

const actors = seed(Actor, {
  story1scene1actor1: {
    id: 1,
    name: 'Donald Trump',
    description: 'The 45th and current President of the United States. Before entering politics he was a businessman and television personality. Trump was born and raised in Queens, New York City, and earned an economics degree from the Wharton School.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/1024px-Donald_Trump_official_portrait.jpg'
  },
})

const maps = seed(Map, {
  map1: {
    id: 1,
    coords: '37, 55',
    zoom: 3,
    style: 'satellite'
  },
})

const scenes = seed(Scene,
  ({stories}) => ({
     story1scene1: {
      id: 1,
      story_id: stories.story1.id,
      title: 'Act I',
      position: 0,
      paragraphsHTML: [`<p>On Tuesday, when Donald Trump abruptly dismissed the F.B.I. director, <strong>James Comey</strong>, his Administration insisted that he was merely following the recommendation of his Attorney General and Deputy Attorney General, the two most senior officials in the Justice Department.<br /><br /><blockquote>In a three-page memorandum attached to Comey's termination letter, the Deputy Attorney General, <strong>Rod J. Rosenstein</strong>, cited concern for the F.B.I.'s &quot;reputation and credibility.&quot;</blockquote>He said that the director had defied Justice Department policies and traditions and overstepped his authority in the way he handled the Hillary Clinton e-mail investigation.<br /><br />This was a puzzling assertion from the Trump Administration, not least because Trump is widely acknowledged to have reaped the benefits of Comey's actions on Election Day. After the F.B.I. director sent his letter to Congress, on October 28th, about the discovery of new Clinton e-mails and the Bureau's plans to assess them, Trump praised Comey for his &quot;guts&quot; and called the news &quot;bigger than Watergate.&quot;<br /><br />In the aftermath of Comey's firing, Democrats and some Republicans in Congress have proposed a far more credible explanation for Trump's action, accusing the President of trying to halt the F.B.I.'s investigation into Russian interference in the election and possible collusion with his campaign. Some of those legislators, as well as many critics in the press, have said that Trump has ignited a constitutional crisis, and they called for the appointment of an independent prosecutor to carry out the Russia investigation.<br /><br /><blockquote>Comey's dismissal came just as his Russia probe appeared to be widening.</blockquote>Just last week, the F.B.I. director went to Rosenstein, who had been in his job only for a few days, to ask for significantly more resources in order to accelerate the investigation, according to the Times. Tensions between the Trump Administration and Comey had been escalating already, and Trump's fury over the F.B.I.'s Russia probe remained full-throated. On Monday, Trump tweeted that the inquiry was a &quot;taxpayer funded charade.&quot;</p><br /><br /><blockquote>It is now clear that the aim of Rosenstein's memo was simply to provide a pretext for Comey's firing.</blockquote><br /><br /><p>White House officials may have thought it would be a persuasive rationale because Comey has come in for criticism from leaders of both political parties. Trump had been harboring a long list of grievances against the F.B.I. director, including his continued pursuit of the Russia probe. On Thursday, Trump confirmed in an interview with NBC News's Lester Holt that, even before he received the Deputy Attorney General's memo, he had already made up his mind to dismiss Comey. In the end, Comey's conspicuous independence—for so long, his greatest asset—proved his undoing, making him too grave a threat to Trump but also giving the President a plausible excuse to fire him.</p><br /><br />`],
    },
  })
)


const scenesActors = seed(ScenesActors,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({scenes, actors}) => ({
    scene1actor1: {
      scene_id: scenes.story1scene1.id,
      actor_id: actors.story1scene1actor1.id,
    },
  })
)

const scenesMaps = seed(ScenesMaps,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({scenes, maps}) => ({
    scene1actor1: {
      scene_id: scenes.story1scene1.id,
      map_id: maps.map1.id,
    },
  })
)


if (module === require.main) {
  db.didSync
    .then(() => db.sync({force: true}))
    .then(seedEverything)
    .finally(() => process.exit(0))
}

class BadRow extends Error {
  constructor(key, row, error) {
    super(error)
    this.cause = error
    this.row = row
    this.key = key
  }

  toString() {
    return `[${this.key}] ${this.cause} while creating ${JSON.stringify(this.row, 0, 2)}`
  }
}

// seed(Model: Sequelize.Model, rows: Function|Object) ->
//   (others?: {...Function|Object}) -> Promise<Seeded>
//
// Takes a model and either an Object describing rows to insert,
// or a function that when called, returns rows to insert. returns
// a function that will seed the DB when called and resolve with
// a Promise of the object of all seeded rows.
//
// The function form can be used to initialize rows that reference
// other models.
function seed(Model, rows) {
  return (others={}) => {
    if (typeof rows === 'function') {
      rows = Promise.props(
        mapValues(others,
          other =>
            // Is other a function? If so, call it. Otherwise, leave it alone.
            typeof other === 'function' ? other() : other)
      ).then(rows)
    }

    return Promise.resolve(rows)
      .then(rows => Promise.props(
        Object.keys(rows)
          .map(key => {
            const row = rows[key]
            return {
              key,
              value: Promise.props(row)
                .then(row => Model.create(row)
                  .catch(error => { throw new BadRow(key, row, error) })
                )
            }
          }).reduce(
            (all, one) => Object.assign({}, all, {[one.key]: one.value}),
            {}
          )
        )
      )
      .then(seeded => {
        console.log(`Seeded ${Object.keys(seeded).length} ${Model.name} OK`)
        return seeded
      }).catch(error => {
        console.error(`Error seeding ${Model.name}: ${error} \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {users, stories, actors, scenesActors, scenesMaps})
