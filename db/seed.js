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

const users = seed(User, {
  jacob: {
    username: 'jake',
    display_name: 'Jacob K',
    email: 'jacob@omri.omri',
    password: '123',
  },
  Hannah_Beech: {
    username: 'hbeech',
    display_name: 'Hannah Beech, The New Yorker',
    email: 'hb@newyorker.com',
    password: '123',
  },
  Fred_Kaplan: {
    username: 'fkaplan',
    display_name: 'Fred Kaplan, The New Yorker',
    email: 'fk@newyorker.com',
    password: '123'
  }
})

const stories = seed(Story,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({users}) => ({
    NorthKorea: {
      id: 1,
      title: `North Korea's Consistently Apocalyptic Propagandists`,
      user_id: users.Hannah_Beech.id
    },
    Cecile: {
      id: 2,
      title: `Cécile Mclorin Salvant's Timeless Jazz`,
      user_id: users.Fred_Kaplan.id
    }
  })
)

const scenes = seed(Scene,
  ({stories}) => ({
    NK1: {
      id: 1,
      story_id: stories.NorthKorea.id,
      title: 'May 2nd',
      position: 0,
      paragraphsHTML: [`<p>On May 2nd, as a U.S. carrier-strike group cruised the waters off the Korean peninsula, anticipating that North Korea might soon conduct a sixth nuclear test, Pyongyang's propagandists were ready with an apocalyptic prediction. &quot;Our preemptive nuclear attacks will bring the provocateurs nothing but tragic consequences,&quot; an English-language commentary in Rodong Sinmun, the official paper of the Central Committee of the Workers' Party of Korea, warned. </p><blockquote>&quot;South Korea will be submerged in a sea of fire, Japan will be reduced to ashes, and the U.S. will collapse.&quot;</blockquote>`],
    },
    NK2: {
      id: 2,
      story_id: stories.NorthKorea.id,
      title: `May 14th`,
      position: 1,
      paragraphsHTML: [`<p>On <em>May 14th</em>, Pyongyang test-fired at high trajectory a missile that soared for half an hour before plunging into waters between North Korea and Japan. No sea of fire engulfed South Korea; Japan and the U.S. remained very much intact. Still, the fact that the missile test occurred just days after the South had inaugurated a new President, Moon Jae-in, who had pledged to engage with the North, confirmed Pyongyang's impulse for provocation. This test marked a step up in the North's threats, something usually effected with words alone. Last month, the official Korean Central News Agency, or KCNA, had responded to U.S.-South Korean Navy drills by railing against the</p><p><br /></p><div><img src=\"http://i.ndtvimg.com/i/2016-06/uss-john-c-stennis-reuters_650x400_51465963337.jpg\" /></div><p><br /></p><p>&quot;U.S. imperialist aggressor forces and warmongers of the south Korean military.&quot; On April 27th, a North Korean-run Web site featured a nearly two-and-a-half-minute video in which a military target was superimposed over the White House and a blaze of fire engulfed the U.S. Capitol.</p>`]
    },
    NK3: {
      id: 3,
      story_id: stories.NorthKorea.id,
      title: `North Korean Rhetoric`,
      postion: 2,
      heroURL: `https://images.unsplash.com/photo-1485287442400-90e0eaed3a60?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=9bf685e757c9280e393668d9fee3c1aa`,
      paragraphsHTML: [`<p>By North Korean standards, this latest propaganda onslaught was neither remarkable nor particularly bellicose. In 2014, a KCNA article quoted a person, identified as a North Korean steelworker, who characterized Barack Obama as a &quot;wicked black monkey.&quot; Another story likened South Korea's recently ousted President Park Geun-hye, who had taken a hard line against the North, to a &quot;vile prostitute serving the U.S.&quot; Yet another conservative former South Korean President, Lee Myung-bak, was described with &quot;sweats, snivels and tears all over his face.&quot; (KCNA has not critiqued Moon Jae-in, the victor in the May 9th South Korean Presidential elections, perhaps because of his softer stance toward the North.) If nothing else, Pyongyang's propaganda czars know how to exploit the bounty of a thesaurus.</p><p><br /></p><p>North Korea's rhetoric has remained on a war footing for decades, a reminder that even though the South and North laid down their guns after a <strong>1953 armistice</strong>, no enduring peace treaty was ever reached. Donald Trump may have warned Reuters on April 27th of a potential &quot;major, major conflict with North Korea,&quot; but, from the point of view of the Democratic People's Republic of Korea, the war never stopped. In a May 8th salvo, a Rodong Sinmun commentary accused Trump and his &quot;henchmen&quot; of pursuing a &quot;hostile&quot; North Korea policy that reflected a &quot;dull-witted and wild character.&quot; With South Korea's new President Moon adopting a conciliatory tone in his May 10th inaugural address, even expressing a willingness to visit Pyongyang, Rodong Sinmun attempted to pick apart the U.S.-South Korean relationship. &quot;The U.S. is going to flee from south Korea after igniting a nuclear war on the Korean peninsula,&quot; predicted a May 11th English-language editorial. &quot;This is the sinister intention of the U.S. vociferating about ‘solid alliance' with south Korea.&quot;</p>`]
    },
    CMS2: {
      id: 5,
      story_id: stories.Cecile.id,
      position: 1,
      heroURL: `https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=f9835518115e48ae328a33890fc683d6`,
      paragraphsHTML: [`<p>She and her trio—a pianist, a bassist, and a drummer, all men in their early thirties—emerged from the dressing lounge and took their places on a lit-up stage: the men in sharp suits, Salvant wearing a gold-colored Issey Miyake dress, enormous pink-framed glasses, and a wide, easy smile. She nodded to the crowd and took a few glances at the walls, which were crammed with photographs of jazz icons who had played there: Sonny Rollins cradling a tenor saxophone, Dexter Gordon gazing through a cloud of cigarette smoke, Charlie Haden plucking a bass with back-bent intensity. This was the first time Salvant had been booked at the club—for jazz musicians, a sign that they'd made it and a test of whether they'd go much farther. She seemed very happy to be there.</p><p><br /></p><p><br /></p><div><img src=\"https://jazzyoutoo.files.wordpress.com/2014/09/village-vanguard2.jpg\" /></div><p><br /></p><p><br /></p><p>The set opened with Irving Berlin's &quot;Let's Face the Music and Dance,&quot; and it was clear right away that the hype was justified. She sang with perfect intonation, elastic rhythm, an operatic range from thick lows to silky highs. She had emotional range, too, inhabiting different personas in the course of a song, sometimes even a phrase—delivering the lyrics in a faithful spirit while also commenting on them, mining them for unexpected drama and wit. Throughout the set, she ventured from the standard repertoire into off-the-beaten-path stuff like Bessie Smith's &quot;Sam Jones Blues,&quot; a funny, rowdy rebuke to a misbehaving husband, and &quot;Somehow I Never Could Believe,&quot; a song from &quot;Street Scene,&quot; an obscure opera by Kurt Weill and Langston Hughes. She unfolded Weill's tune, over ten minutes, as the saga of an entire life: a child's promise of bright days ahead, a love that blossoms and fades, babies who wrap &quot;a ring around a rosy&quot; and then move away. When she sang, &quot;It looks like something awful happens / in the kitchens / where women wash their dishes,&quot; her plaintive phrasing transformed a description of domestic obligation into genuine tragedy. A hush washed over the room.</p>`]
    }
  })
);

const actors = seed(Actor, {
  North_Korea_Actor: {
    id: 1,
    name: 'North Korea',
    description: `North Korea, officially the Democratic People's Republic of Korea (DPRK  listen), is a country in East Asia constituting the northern part of the Korean Peninsula. Pyongyang is the nation's capital and largest city.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/1600px-Flag_of_North_Korea.svg.png`
  },
  Pyongyang: {
    id: 2,
    name: `Pyongyang`,
    description: `Pyongyang is located on the Taedong River about 109 kilometres (68 mi) upstream from its mouth on the West Korea Sea and, according to preliminary results from the 2008 population census, has a population of 3,255,388.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/b/b1/Pyongyang_montage.png`
  },
  Rodong_Sinmun: {
    id: 3,
    name: `Rodong Sinmun`,
    description: `A North Korean newspaper that is the official newspaper of the Central Committee of the Workers' Party of Korea. It was first published on November 1, 1945, as Chǒngro`,
    image: `https://upload.wikimedia.org/wikipedia/en/3/30/Rodong_sinmun_frontpage.jpg`
  },
  Central_Committee: {
    id: 4,
    name: `Central Committee of the Workers' Party of Korea`,
    description: `the leadership body of the Workers' Party of Korea (WPK). According to Party rules, the Central Committee directs the Party work between the Party Congresses. It is elected by the Party Congress itself, although Party conferences can be called to perform this duty as well. The current Central Committee, the 6th, was elected by the 6th WPK Congress in 1980.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Emblem_of_North_Korea.svg/330px-Emblem_of_North_Korea.svg.png`
  },
  South_Korea: {
    id: 5,
    name: `South Korea`,
    description: `A sovereign state in East Asia, constituting the southern part of the Korean Peninsula. Officially, its territory consists of the whole Korean Peninsula and its adjacent islands, which are largely mountainous.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/900px-Flag_of_South_Korea.svg.png`
  },
  Japan: {
    id: 6,
    name: `Japan`,
    description: `Located in the Pacific Ocean, it lies off the eastern coast of the Asian mainland, and stretches from the Sea of Okhotsk in the north to the East China Sea and Taiwan in the southwest.`,
    image: `https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/900px-Flag_of_Japan.svg.png`
  },
  Moon: {
    id: 7,
    name: `Moon Jae-In`,
    description: `The 12th and current President of South Korea. Formally, he is also considered the 19th President of South Korea based on the number of presidential terms in the country's history.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/2/21/Moon_Jae-in_May_2017.jpg`
  },
  KCNA: {
    id: 8,
    name: `Korean Central News Agency`,
    description: `The Korean Central News Agency (KCNA) is the state news agency of North Korea that was established on December 5, 1946. The agency portrays the views of the North Korean government for foreign consumption.`,
    image: `https://upload.wikimedia.org/wikipedia/en/4/43/Korean_Central_News_Agency_logo.png`
  },
  White_House: {
    id: 9,
    name: `White House`,
    description: `The White House is the official residence and workplace of the President of the United States, located at 1600 Pennsylvania Avenue NW in Washington, D.C. It has been the residence of every U.S. president since John Adams in 1800.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/White_House_north_and_south_sides.jpg/1280px-White_House_north_and_south_sides.jpg`
  },
  Donald_Trump: {
    id: 10,
    name: `Donald Trump`,
    description: `Donald John Trump (born June 14, 1946) is the 45th and current President of the United States. Before entering politics he was a businessman and television personality.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/1280px-Donald_Trump_official_portrait.jpg`
  },
  Barack_Obama: {
    id: 11,
    name: `Barack_Obama`,
    description: `an American politician who served as the 44th President of the United States from 2009 to 2017. He is the first African American to have served as president. He previously served in the U.S. Senate representing Illinois from 2005 to 2008, and in the Illinois State Senate from 1997 to 2004.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/1280px-President_Barack_Obama.jpg`
  },
  Park: {
    id: 12,
    name: `Park Geun_hye`,
    description: `a South Korean former politician who served as the 11th President of South Korea from 2013 to 2017.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/4/40/Park_Geun-hye_%288724400493%29_%28cropped%29.jpg`
  },
  Lee: {
    id: 13,
    name: `Lee Myung-bak`,
    description: `South Korean politician and businessman who served as the 10th President of South Korea from 25 February 2008 to 25 February 2013. Before his election as president, he was the CEO of Hyundai Engineering and Construction, as well as the mayor of Seoul from 1 July 2002, to 30 June 2006. `,
    image: `https://upload.wikimedia.org/wikipedia/commons/7/72/Sebasti%C3%A1n_Pi%C3%B1era_-_Lee_Myung-bak_%28cropped%29.jpg`
  },
  Reuters: {
    id: 14,
    name: `Reuters`,
    description: `Reuters /ˈrɔɪtərz/ is an international news agency headquartered in London, England. It is a division of Thomson Reuters.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Reuters-Building-30SC.JPG/1920px-Reuters-Building-30SC.JPG`
  }
})

const scenesActors = seed(ScenesActors,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({scenes, actors}) => ({
    11: {
      scene_id: scenes.NK1.id,
      actor_id: actors.North_Korea_Actor.id,
    },
    12: {
      scene_id: scenes.NK1.id,
      actor_id: actors.Pyongyang.id,
    },
    13: {
      scene_id: scenes.NK1.id,
      actor_id: actors.Rodong_Sinmun.id,
    },
    14: {
      scene_id: scenes.NK1.id,
      actor_id: actors.Central_Committee.id,
    },
    15: {
      scene_id: scenes.NK1.id,
      actor_id: actors.South_Korea.id,
    },
    16: {
      scene_id: scenes.NK1.id,
      actor_id: actors.Japan.id,
    },
    21: {
      scene_id: scenes.NK2.id,
      actor_id: actors.North_Korea_Actor.id
    },
    26: {
      scene_id: scenes.NK2.id,
      actor_id: actors.Japan.id,
    },
    27: {
      scene_id: scenes.NK2.id,
      actor_id: actors.Moon.id
    },
    22: {
      scene_id: scenes.NK2.id,
      actor_id: actors.Pyongyang.id
    },
    28: {
      scene_id: scenes.NK2.id,
      actor_id: actors.KCNA.id
    },
    29: {
      scene_id: scenes.NK2.id,
      actor_id: actors.White_House.id
    },
    33: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Rodong_Sinmun.id
    },
    310: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Donald_Trump.id
    },
    311: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Barack_Obama.id
    },
    312: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Park.id
    },
    313: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Lee.id
    },
    37: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Moon.id
    },
    314: {
      scene_id: scenes.NK3.id,
      actor_id: actors.Reuters.id
    }
  })
)

const maps = seed(Map, {
  North_Korea_Map: {
    id: 1,
    coords: `127.510093, 40.339852`,
    zoom: 3,
    style: 'satellite'
  },
  Pyongyang_map: {
    id: 2,
    coords: `125.7625241, 39.0392193`,
    zoom: 12,
    style: `satellite`
  }
})

const scenesMaps = seed(ScenesMaps,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({scenes, maps}) => ({
    11: {
      scene_id: scenes.NK1.id,
      map_id: maps.North_Korea_Map.id,
    },
    22: {
      scene_id: scenes.NK2.id,
      map_id: maps.Pyongyang_map.id
    }
  })
)


module.exports = Object.assign(seed, {users, stories, actors, scenesActors, scenesMaps})
