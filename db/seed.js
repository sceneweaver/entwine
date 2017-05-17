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
  },
  Steven_Levy: {
    username: 'slevy',
    display_name: `Steven Levy, Wired`,
    email: `slevy@wired.com`,
    password: `123`
  }
})

const stories = seed(Story,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  ({users}) => ({
    NorthKorea: {
      title: `North Korea's Consistently Apocalyptic Propagandists`,
      user_id: users.Hannah_Beech.id
    },
    Cecile: {
      title: `Cécile McLorin Salvant's Timeless Jazz`,
      user_id: users.Fred_Kaplan.id
    },
    Apple: {
      title: `One More Thing--Apple's New Campus: An Exclusive Look Inside the Mothership`,
      user_id: users.Steven_Levy.id
    }
  })
)

const scenes = seed(Scene,
  ({stories}) => ({
    NK1: {
      story_id: stories.NorthKorea.id,
      title: 'May 2nd',
      position: 0,
      paragraphsHTML: [`<p>On May 2nd, as a U.S. carrier-strike group cruised the waters off the Korean peninsula, anticipating that North Korea might soon conduct a sixth nuclear test, Pyongyang's propagandists were ready with an apocalyptic prediction. &quot;Our preemptive nuclear attacks will bring the provocateurs nothing but tragic consequences,&quot; an English-language commentary in Rodong Sinmun, the official paper of the Central Committee of the Workers' Party of Korea, warned. </p><blockquote>&quot;South Korea will be submerged in a sea of fire, Japan will be reduced to ashes, and the U.S. will collapse.&quot;</blockquote>`],
    },
    NK2: {
      story_id: stories.NorthKorea.id,
      title: `May 14th`,
      position: 1,
      paragraphsHTML: [`<p>On <em>May 14th</em>, Pyongyang test-fired at high trajectory a missile that soared for half an hour before plunging into waters between North Korea and Japan. No sea of fire engulfed South Korea; Japan and the U.S. remained very much intact. Still, the fact that the missile test occurred just days after the South had inaugurated a new President, Moon Jae-in, who had pledged to engage with the North, confirmed Pyongyang's impulse for provocation. This test marked a step up in the North's threats, something usually effected with words alone. Last month, the official Korean Central News Agency, or KCNA, had responded to U.S.-South Korean Navy drills by railing against the</p><p><br /></p><div><img src=\"http://i.ndtvimg.com/i/2016-06/uss-john-c-stennis-reuters_650x400_51465963337.jpg\" /></div><p><br /></p><p>&quot;U.S. imperialist aggressor forces and warmongers of the south Korean military.&quot; On April 27th, a North Korean-run Web site featured a nearly two-and-a-half-minute video in which a military target was superimposed over the White House and a blaze of fire engulfed the U.S. Capitol.</p>`]
    },
    NK3: {
      story_id: stories.NorthKorea.id,
      title: `North Korean Rhetoric`,
      position: 2,
      heroURL: `https://images.unsplash.com/photo-1485287442400-90e0eaed3a60?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=9bf685e757c9280e393668d9fee3c1aa`,
      paragraphsHTML: [`<p>By North Korean standards, this latest propaganda onslaught was neither remarkable nor particularly bellicose. In 2014, a KCNA article quoted a person, identified as a North Korean steelworker, who characterized Barack Obama as a &quot;wicked black monkey.&quot; Another story likened South Korea's recently ousted President Park Geun-hye, who had taken a hard line against the North, to a &quot;vile prostitute serving the U.S.&quot; Yet another conservative former South Korean President, Lee Myung-bak, was described with &quot;sweats, snivels and tears all over his face.&quot; (KCNA has not critiqued Moon Jae-in, the victor in the May 9th South Korean Presidential elections, perhaps because of his softer stance toward the North.) If nothing else, Pyongyang's propaganda czars know how to exploit the bounty of a thesaurus.</p><p><br /></p><p>North Korea's rhetoric has remained on a war footing for decades, a reminder that even though the South and North laid down their guns after a <strong>1953 armistice</strong>, no enduring peace treaty was ever reached. Donald Trump may have warned Reuters on April 27th of a potential &quot;major, major conflict with North Korea,&quot; but, from the point of view of the Democratic People's Republic of Korea, the war never stopped. In a May 8th salvo, a Rodong Sinmun commentary accused Trump and his &quot;henchmen&quot; of pursuing a &quot;hostile&quot; North Korea policy that reflected a &quot;dull-witted and wild character.&quot; With South Korea's new President Moon adopting a conciliatory tone in his May 10th inaugural address, even expressing a willingness to visit Pyongyang, Rodong Sinmun attempted to pick apart the U.S.-South Korean relationship. &quot;The U.S. is going to flee from south Korea after igniting a nuclear war on the Korean peninsula,&quot; predicted a May 11th English-language editorial. &quot;This is the sinister intention of the U.S. vociferating about ‘solid alliance' with south Korea.&quot;</p>`]
    },
    CMS1: {
      story_id: stories.Cecile.id,
      title: `At the Village Vanguard`,
      position: 0,
      heroURL: `https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=f9835518115e48ae328a33890fc683d6`,
      paragraphsHTML: [`<p>On a Thursday evening a few months ago, a long line snaked along Seventh Avenue, outside the <em>Village Vanguard</em>, a cramped basement night club in Greenwich Village that jazz fans regard as a temple. The eight-thirty set was sold out, as were the ten-thirty set and nearly all the other shows that week. The people descending the club's narrow steps had come to hear a twenty-seven-year-old singer named <strong>Cécile McLorin Salvant</strong>. In its sixty years as a jazz club, the Vanguard has headlined few women and fewer singers of either gender. But Salvant, virtually unknown two years earlier, had built an avid following, winning a Grammy and several awards from critics, who praised her singing as &quot;singularly arresting&quot; and</p><blockquote>&quot;artistry of the highest class.&quot;</blockquote>`]
    },
    CMS2: {
      story_id: stories.Cecile.id,
      title: `The Trio`,
      position: 1,
      paragraphsHTML: [`<p>She and her trio—a pianist, a bassist, and a drummer, all men in their early thirties—emerged from the dressing lounge and took their places on a lit-up stage: the men in sharp suits, Salvant wearing a gold-colored Issey Miyake dress, enormous pink-framed glasses, and a wide, easy smile. She nodded to the crowd and took a few glances at the walls, which were crammed with photographs of jazz icons who had played there: Sonny Rollins cradling a tenor saxophone, Dexter Gordon gazing through a cloud of cigarette smoke, Charlie Haden plucking a bass with back-bent intensity. This was the first time Salvant had been booked at the club—for jazz musicians, a sign that they'd made it and a test of whether they'd go much farther. She seemed very happy to be there.</p><p><br /></p><p><br /></p><div><img src=\"https://jazzyoutoo.files.wordpress.com/2014/09/village-vanguard2.jpg\" /></div><p><br /></p><p><br /></p><p>The set opened with Irving Berlin's &quot;Let's Face the Music and Dance,&quot; and it was clear right away that the hype was justified. She sang with perfect intonation, elastic rhythm, an operatic range from thick lows to silky highs. She had emotional range, too, inhabiting different personas in the course of a song, sometimes even a phrase—delivering the lyrics in a faithful spirit while also commenting on them, mining them for unexpected drama and wit. Throughout the set, she ventured from the standard repertoire into off-the-beaten-path stuff like Bessie Smith's &quot;Sam Jones Blues,&quot; a funny, rowdy rebuke to a misbehaving husband, and &quot;Somehow I Never Could Believe,&quot; a song from &quot;Street Scene,&quot; an obscure opera by Kurt Weill and Langston Hughes. She unfolded Weill's tune, over ten minutes, as the saga of an entire life: a child's promise of bright days ahead, a love that blossoms and fades, babies who wrap &quot;a ring around a rosy&quot; and then move away. When she sang, &quot;It looks like something awful happens / in the kitchens / where women wash their dishes,&quot; her plaintive phrasing transformed a description of domestic obligation into genuine tragedy. A hush washed over the room.</p>`]
    },
    CMS3: {
      story_id: stories.Cecile.id,
      title: `Influences`,
      position: 2,
      paragraphsHTML: [`<p>Wynton Marsalis, who has twice hired Salvant to tour with his Jazz at Lincoln Center Orchestra, told me,</p><blockquote>&quot;You get a singer like this once in a generation or two.&quot;</blockquote><p>Salvant might not have reached this peak just yet, he said. But, he added, &quot;could Michael Jordan do all he would do in his third year? No, but you could tell what he was going to do. Cécile's the same way.&quot;</p><p><br /></p><p>It was only because of a series of flukes that she became a jazz singer at all. Cécile Sophie McLorin Salvant was born in Miami on August 28, 1989. She began piano lessons at four and joined a local choir at eight, all the while taking in the music that her mother played on the stereo—classical, jazz, pop, folk, Latin, Senegalese. At ten, she saw Charlotte Church, a pop-culture phenomenon just a few years older, singing opera on a TV show. &quot;This girl was making people cry with her singing,&quot; Salvant recalled, sitting in her apartment, a walkup on a block of brownstones in Harlem. &quot;I was attracted by how she could tap into emotions like that. I said, ‘I want to do that, too.' &quot;</p>`]
    },
    CMS4: {
      story_id: stories.Cecile.id,
      title: `Musical Upbringing`,
      position: 3,
      paragraphsHTML: [`<p>She grew up in a French-speaking household: her father, a doctor, is Haitian, and her mother, who heads an elementary school, is French. At eighteen, Cécile decided that she wanted to live in France, so she enrolled at the <em>Darius Milhaud Conservatory</em>, in Aix-en-Provence, and at a nearby prep school that offered courses in political science and law. Her mother, who came along to help her get settled, saw a listing for a class in jazz singing and suggested that Cécile sign up.</p><p><br /></p><div><img src=\"http://www.aixenprovencetourism.com/img.ashx?u=http://server.cominsit.odt.local/OpenData/Medias/48730/PATIO-41f30be7-fb0d-4a0a-ab01-be55864d5856_636075763581171953.jpg&amp;w=470&amp;h=325&amp;r=crop\" /></div><p><br /></p><p>&quot;I said, ‘O.K., whatever,' &quot; Cécile told me. &quot;I was passive—super passive.&quot; At an audition for the class, she sang &quot;Misty,&quot; which she knew from a Sarah Vaughan album that her mother often played. After she finished, the teacher, who'd been accompanying on piano, asked her to improvise. She didn't know what that meant, nor did she care. &quot;I didn't want to get into his class anyway,&quot; she recalled. &quot;I had poli-sci, law, classical voice—I didn't have time.&quot;</p><p><br /></p><p>But the teacher, a jazz musician named Jean-François Bonnel, was astonished by her singing. &quot;Cécile was something else,&quot; he wrote to me in an e-mail. &quot;She already had everything—the right time, the sense of rhythm, the right intonation, an incredible Sarah Vaughan type of voice&quot;—a pure bel canto, with exceptional range and precision. Two days later, Bonnel ran into her on the street and told her that he'd come ring her doorbell until she signed up for his class. &quot;I always obeyed my parents and my teachers,&quot; Salvant recalled, with a laugh. She enrolled, and found that she liked it. &quot;There were all these cool people with dreads and cigarettes,&quot; she said. &quot;It was very different from the classical-music program, with these precious girls, or the poli-sci school, which was full of rich kids from Saint-Tropez, very arrogant, politically on the right. I had nothing to say to those people. So I figured the jazz department would be like a good hobby—a place to make friends, like going to a community-theatre class.&quot;</p>`]
    },
    A1: {
      story_id: stories.Apple.id,
      position: 0,
      title: `Origin Story`,
      paragraphsHTML: [`<p>On <em>June 7, 2011</em>, a local businessman addressed a meeting of the Cupertino City Council. He had not been on the agenda, but his presence wasn't a total surprise. Earlier in the year the man had expressed his intention to attend a meeting in order to propose a new series of buildings along the city's northern border, but he hadn't felt up to it at the time. He was, as all of them knew, in dire health.</p><p><br /></p><p>Before the start of the meeting, Kris Wang, a Cupertino council­member, looked out the window at the back of the room and saw him walking toward the building. He moved with obvious difficulty, wearing the same outfit he had been seen in the day before when he'd introduced new products to the world—which is to say, the same outfit that anyone had ever seen him wear. When it was his turn to address the council, he walked to the podium. He began to speak, tentative at first before clicking into the conversational yet hypnotically compelling tone he used in keynotes.</p><p><br /></p><p>His company, he said, had &quot;grown like a weed.&quot; His workforce had increased significantly over a decade, coming to fill more than 100 buildings as workers created one blockbuster product after another. To consolidate his employees, he wanted to create a new campus, a verdant landscape where the border between nature and building would be blurred. Unlike other corporate campuses, which he found &quot;pretty boring,&quot; this would feature as its centerpiece a master structure, shaped like a circle, that would hold 12,000 employees. </p><blockquote>&quot;It's a pretty amazing building,&quot; he told them. &quot;It's a little like a spaceship landed.&quot;</blockquote><p>When Wang asked what benefit would come to Cupertino from this massive enterprise, the speaker had a slight edge to his voice as he explained, as if to a child, that it would enable the company to stay in the California township. Otherwise, it could sell off its current properties and take its people with it, maybe to someplace nearby, like Mountain View. That unpleasantness out of the way, the speaker was able to return to the subject of what he would create.</p><p><br /></p><p>&quot;I think we do have a shot,&quot; he told the council, &quot;of building the best office building in the world.&quot; What he didn't tell them—during what none of them could have known would be his last public appearance—is that he was not just planning a new campus for the company he cofounded, built, left, returned to, and ultimately saved from extinction. Through this new headquarters, <strong>Steve Jobs</strong> was planning the future of <strong>Apple</strong> itself—a future beyond him and, ultimately, beyond any of us.</p>`]
    },
    A2: {
      story_id: stories.Apple.id,
      position: 1,
      title: `Apple Park`,
      heroURL: `https://images.unsplash.com/photo-1434494243370-596416019a0d?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=915043a427ccba0b16881c7acd7a9f14`,
      paragraphsHTML: [`<p>On a crisp and clear March day, more than five years after Jobs' death, I'm seated next to <strong>Jonathan Ive</strong> in the back of a Jeep Wrangler as we prepare to tour the nearly completed <strong>Apple Park</strong>, the name recently bestowed on the campus that Jobs pitched to the Cupertino City Council in 2011. At 50, Apple's design chieftain still looks like the rugby player he once was, and he remains, despite fame, fortune, and a knighthood, the same soft-spoken Brit I met almost 20 years ago. We are both wearing white hard hats with a silver Apple logo above the brim; Ive's is personalized with &quot;Jony&quot; underneath the iconic symbol. Dan Whisenhunt, the company's head of facilities and a de facto manager of the project, comes with us. He too has a personalized hat. It is an active construction site on a tight deadline—the first occupants are supposedly moving in within 30 days of my visit, with 500 new employees arriving every week thereafter—and I felt a bit like one of the passengers on the first ride into Jurassic Park.</p><p><br /></p><p>We drive up North Tantau Avenue, past the buildings that will house employees not fortunate enough to sit in the campus's main headquarters, as well as the half-finished visitor's center. Only a few years ago, most of the space was a flat parking lot, but today huge berms—artificial hills—hug the road, blocking views of busy Wolfe Road and Interstate 280 and forming a rolling landscape with hundreds of trees, their roots half-buried in wooden boxes, ready for planting. We drive around campus and turn into the entrance of a tunnel that will take us to the Ring.</p><p><br /></p><div><img src=\"https://cdn.macrumors.com/article-new/2017/05/apple-park-skyline.jpg\" /></div><p><br /></p><p>Of course I've seen images of it, architectural equivalents of movie trailers for a much-awaited blockbuster. From the day Jobs presented to the Cupertino City Council, digital renderings of the Ring, as Apple calls the main building, have circulated widely. As construction progressed, enterprising drone pilots began flying their aircraft overhead, capturing aerial views in slickly edited YouTube videos accompanied by New Agey soundtracks. Amid all the fanboy anticipation, though, Apple has also taken some knocks for the scale and scope of the thing. Investors urging Apple to kick back more of its bounty to shareholders have questioned whether the reported $5 billion in construction costs should have gone into their own pockets instead of a workplace striving for history. And the campus's opening comes at a point when, despite stellar earnings results, Apple has not launched a breakout product since Jobs' death. Apple executives want us to know how cool its new campus is—that's why they invited me. But this has also led some people to sniff that too much of its mojo has been devoted to giant glass panels, custom-built door handles, and a 100,000-square-foot fitness and wellness center complete with a two-story yoga room covered in stone, from just the right quarry in Kansas, that's been carefully distressed, like a pair of jeans, to make it look like the stone at Jobs' favorite hotel in Yosemite.</p><p><br /></p><p>Inside the 755-foot tunnel, the white tiles along the wall gleam like a recently installed high-end bathroom; it's what the Lincoln Tunnel must have looked like the day it opened, before the first smudge of soot sullied its walls. And as we emerge into the light, the Ring comes into view. As the Jeep orbits it, the sun glistens off the building's curved glass surface. The &quot;canopies&quot;—white fins that protrude from the glass at every floor—give it an exotic, retro-­future feel, evoking illustrations from science fiction pulp magazines of the 1950s. Along the inner border of the Ring, there is a walkway where one can stroll the three-quarter-mile perimeter of the building unimpeded. It's a statement of openness, of free movement, that one might not have associated with Apple. And that's part of the point.</p><p><br /></p><p>We drive through an entrance that takes us under the building and into the courtyard before driving back out again. Since it's a ring, of course, there is no main lobby but rather nine entrances. Ive opts to take me in through the café, a massive atrium-like space ascending the entire four stories of the building. Once it's complete, it will hold as many as 4,000 people at once, split between the vast ground floor and the balcony dining areas. Along its exterior wall, the café has two massive glass doors that can be opened when it's nice outside, allowing people to dine al fresco.</p>`]
    },
    A3: {
      story_id: stories.Apple.id,
      position: 2,
      title: `The Site`,
      heroURL: `https://images.unsplash.com/photo-1457803097035-3ace37af34a7?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=e2f148b3a8aab497c5ea54d34d451a9c`,
      paragraphsHTML: [`<p>&quot;This might be a stupid question,&quot; I say. &quot;But why do you need a four-story glass door?&quot;</p><p><br /></p><blockquote>Ive raises an eyebrow. &quot;Well,&quot; he says. &quot;It depends how you define need, doesn't it?&quot;</blockquote><p>We go upstairs, and I take in the view. From planes descending to SFO, and even from drones that buzz the building from a hundred feet above it, the Ring looks like an ominous icon, an expression of corporate power, and a what-the-fuck oddity among the malls, highways, and more mundane office parks of suburban Silicon Valley. But peering out the windows and onto the vast hilly expanse of the courtyard, all of that peels away. It feels … peaceful, even amid the clatter and rumble of construction. It turns out that when you turn a skyscraper on its side, all of its bullying power dissipates into a humble serenity.</p><p><br /></p><p>For the next two hours, Ive and Whisenhunt walk me through other parts of the building and the grounds. They describe the level of attention devoted to every detail, the willingness to search the earth for the right materials, and the obstacles overcome to achieve perfection, all of which would make sense for an actual Apple consumer product, where production expenses could be amortized over millions of units. But the Ring is a 2.8-million-square-foot one-off, eight years in the making and with a customer base of 12,000. How can anyone justify this spectacular effort?</p><p><br /></p><p>&quot;It's frustrating to talk about this building in terms of absurd, large numbers,&quot; Ive says. &quot;It makes for an impressive statistic, but you don't live in an impressive statistic. While it is a technical marvel to make glass at this scale, that's not the achievement. The achievement is to make a building where so many people can connect and collaborate and walk and talk.&quot; The value, he argues, is not what went into the building. It's what will come out.</p>`]
    },
    A4: {
      story_id: stories.Apple.id,
      position: 3,
      title: `The Design`,
      paragraphsHTML: [`<p>A ring was not what Jobs had in mind when he first started talking about a new campus. Ive thinks it was around 2004 when he and his boss first began discussing a reimagined headquarters. &quot;I think it was in Hyde Park,&quot; he says. &quot;When we used to go to London together, we'd spend a lot of time in these parks. We began talking about a campus where your primary sense was that you were in parkland, with many elements that were almost collegiate—where the connection between what was built and a parkland was immediate, no matter where you were.&quot;</p><p><br /></p><p>The discussions continued and widened throughout the company, but it wasn't until 2009 that Apple was ready to actually move on the project. Though vacant land in Cupertino is rare, Apple had purchased 75 acres barely a mile from Infinite Loop, its current headquarters. The company began to seek out the right architectural firm to take on the task, and Jobs came to focus on Norman Foster, a Pritzker Prize winner whose commissions have included the Berlin Reichstag, the Hong Kong airport, and London's infamous &quot;Gherkin&quot; tower. Jobs called Foster in July 2009 and told him, in Foster's recollection, that Apple &quot;needed some help.&quot;</p><p><br /></p><p>Two months later Foster arrived in Cupertino and spent an entire day with Jobs, first at his office at Infinite Loop and later at his home in Palo Alto, and discovered that his new client had a remarkably detailed vision of the glass, steel, stone, and trees that would make up Apple's new home. As Jobs spoke, Foster furiously sketched in the A4 sketchbook he is never without, creating a &quot;word picture&quot; of what Jobs was envisioning. &quot;His touchstone was the quad at Stanford,&quot; Foster says, referring to the main part of the school's campus where low-slung academic buildings, arranged around large, leafy outdoor areas and designed with open-air pathways where one can walk along the structures' edges, offer the sensation of being both inside and out.</p><p><br /></p><div><img src=\"https://cdn.macrumors.com/article-new/2017/05/apple-park-sketch.jpg\" /></div><p><br /></p><p>Foster soon brought in reinforcements from his London-based firm, Foster + Partners, for the first of many meetings Jobs would have with a growing team of architects. Though he always professed to loathe nostalgia, Jobs based many of his ideas on his favorite features of the Bay Area of his youth. &quot;His briefing was all about California—his idealized California,&quot; says Stefan Behling, a Foster partner who became one of the project leads. The site Apple had bought was an industrial park, largely covered by asphalt, but Jobs envisioned hilly terrain, with sluices of walking paths. He again turned to Stanford for inspiration by evoking the Dish, a popular hiking area near the campus where rolling hills shelter a radio telescope.</p><p><br /></p><p>The meetings often lasted for five or six hours, consuming a significant amount of time in the last two years of Jobs' life. He could be scary when he swooped down on a detail he demanded. At one point, Behling recalls, Jobs discussed the walls he had in mind for the offices: &quot;He knew exactly what timber he wanted, but not just ‘I like oak' or ‘I like maple.' He knew it had to be quarter-­cut. It had to be cut in the winter, ideally in January, to have the least amount of sap and sugar content. We were all sitting there, architects with gray hair, going, ‘Holy shit!'&quot;</p>`]
    },
    A5: {
      story_id: stories.Apple.id,
      position: 4,
      title: `Development`,
      paragraphsHTML: [`<p>As with any Apple product, its shape would be determined by its function. This would be a workplace where people were open to each other and open to nature, and the key to that would be modular sections, known as pods, for work or collaboration. Jobs' idea was to repeat those pods over and over: pod for office work, pod for teamwork, pod for socializing, like a piano roll playing a Philip Glass composition. They would be distributed demo­cratically. Not even the CEO would get a suite or a similar incongruity. And while the company has long been notorious for internal secrecy, compartmentalizing its projects on a need-to-know basis, Jobs seemed to be proposing a more porous structure where ideas would be more freely shared across common spaces. Not totally open, of course—Ive's design studio, for instance, would be shrouded by translucent glass—but more open than Infinite Loop.</p><p><br /></p><p>&quot;At first, we had no idea what Steve was actually talking about with these pods. But he had it all mapped out: a space where you could concentrate one minute and then bump into another group of people in the next,&quot; Behling says. &quot;And how many restaurants should we have? One restaurant, a huge one, forcing everyone to get together. You have to be able to bump into each other.&quot; In part Jobs was expanding on a concept that he had developed while helping design the headquarters of another company he ran—Pixar—that nudged collaboration by forcing people to stroll longer than usual to the restrooms. (So involved was Jobs in that project that Pixar-­ites call the building &quot;Steve's Movie.&quot;) In this new project, Jobs was balancing an engineer's need for intense concentration with the brainstorming that unearths innovation.</p><p><br /></p><p>To accommodate the pods, the main building took the shape of a bloated clover leaf—people at Apple called it the propeller—with three lobes doing a Möbius around a center core. But over time Jobs realized that it wouldn't work. &quot;We have a crisis,&quot; he told the architects early in the spring of 2010. &quot;I think it is too tight on the inside and too wide on the outside.&quot; This launched weeks of overtime among Foster's 100-person team to figure out how to resolve the problem. (Their ranks would eventually reach 250.) In May, as he was sketching in his book, Foster wrote down a statement: &quot;On the way to a circle.&quot;</p>`]
    },
    A6: {
      story_id: stories.Apple.id,
      position: 5,
      title: `The Plan`,
      heroURL: `https://qzprod.files.wordpress.com/2017/02/apple-campus-2-iphone-design.jpg?quality=80&strip=all`,
      paragraphsHTML: [`<p>According to Walter Isaacson's biography of Jobs, there was another factor. When Jobs showed a drawing of the clover leaf to his son, Reed, the teenager commented that from the air, the building would look like male genitalia. The next day Jobs repeated the observation to the architects, warning them that from that point on, &quot;you're never going to be able to erase that vision from your mind.&quot; (Foster and Behling say they have no recollection of this.)</p><p><br /></p><p>By June 2010 it was a circle. No one takes full credit for the shape; all seem to feel it was inevitable all along. &quot;Steve dug it right away,&quot; Foster says.</p><p><br /></p><p>By that fall Whisenhunt had heard that a former HP campus in Cupertino might be available. The 100-acre plot was just north of Apple's planned site. What's more, it had deep meaning for Jobs. As a young teen he had talked his way into a summer job at HP, just at the time when its founders—Jobs' heroes—were walking that site and envisioning an office park cluster for their computer systems division. Now HP was contracting and no longer needed the space. Whisenhunt worked a deal, and Apple's project suddenly grew to 175 acres.</p><p><br /></p><p>Jobs had always insisted that most of the site be covered with trees; he even took the step of finding the perfect tree expert to create his corporate Arden. He loved the foliage at the Dish and found one of the arborists responsible. David Muffly, a cheerful, bearded fellow with a Lebowski-ish demeanor, was in a client's backyard in Menlo Park when he got the call to come to Jobs' office to talk trees. He was massively impressed with the Apple CEO's taste and knowledge. &quot;He had a better sense than most arborists,&quot; Muffly says. &quot;He could tell visually which trees looked like they had good structure.&quot; Jobs was adamant that the new campus house indigenous flora, and in particular he wanted fruit trees from the orchards he remembered from growing up in Northern California.</p><p><br /></p><p>Apple will ultimately plant almost 9,000 trees. Muffly was told that the landscape should be futureproof and that he should choose drought-tolerant varieties so his mini forest and meadows could survive a climate crisis. (As part of its ecological efforts to prevent such a crisis, Apple claims, its buildings will run solely on sustainable energy, most of it from solar arrays on the roofs.) Jobs' aims were not just aesthetic. He did his best thinking during walks and was especially inspired by ambling in nature, so he envisioned how Apple workers would do that too. &quot;Can you imagine doing your work in a national park?&quot; says Tim Cook, who succeeded Jobs as CEO in 2011. &quot;When I really need to think about something I'm struggling with, I get out in nature. We can do that now! It won't feel like Silicon Valley at all.&quot;</p><p><br /></p><p>Cook recalls the last time he discussed the campus with his boss and friend in the fall of 2011. &quot;It was actually the last time I spoke to him, the Friday before he passed away,&quot; Cook says. &quot;We were watching a movie, Remember the Titans. I loved it, but I was so surprised he liked that movie. I remember talking to him about the site then. It was something that gave him energy. I was joking with him that we were all worried about some things being difficult, but we were missing the most important one, the biggest challenge of all.&quot;</p><p><br /></p><p>Which was?</p><p><br /></p><p>&quot;Deciding which employees are going to sit in the main building&quot; and which would have to work in the outer buildings. &quot;And he just got a big laugh out of it.&quot;</p><p><br /></p><blockquote>ALL THAT WAS left for Apple to do was build it.</blockquote>`]
    }
  })
);

const actors = seed(Actor, {
  North_Korea_Actor: {
    name: 'North Korea',
    description: `North Korea, officially the Democratic People's Republic of Korea (DPRK  listen), is a country in East Asia constituting the northern part of the Korean Peninsula. Pyongyang is the nation's capital and largest city.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/1600px-Flag_of_North_Korea.svg.png`
  },
  Pyongyang: {
    name: `Pyongyang`,
    description: `Pyongyang is located on the Taedong River about 109 kilometres (68 mi) upstream from its mouth on the West Korea Sea and, according to preliminary results from the 2008 population census, has a population of 3,255,388.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/b/b1/Pyongyang_montage.png`
  },
  Rodong_Sinmun: {    name: `Rodong Sinmun`,
    description: `A North Korean newspaper that is the official newspaper of the Central Committee of the Workers' Party of Korea. It was first published on November 1, 1945, as Chǒngro`,
    image: `https://upload.wikimedia.org/wikipedia/en/3/30/Rodong_sinmun_frontpage.jpg`
  },
  Central_Committee: {    name: `Central Committee of the Workers' Party of Korea`,
    description: `the leadership body of the Workers' Party of Korea (WPK). According to Party rules, the Central Committee directs the Party work between the Party Congresses. It is elected by the Party Congress itself, although Party conferences can be called to perform this duty as well. The current Central Committee, the 6th, was elected by the 6th WPK Congress in 1980.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Emblem_of_North_Korea.svg/330px-Emblem_of_North_Korea.svg.png`
  },
  South_Korea: {    name: `South Korea`,
    description: `A sovereign state in East Asia, constituting the southern part of the Korean Peninsula. Officially, its territory consists of the whole Korean Peninsula and its adjacent islands, which are largely mountainous.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/900px-Flag_of_South_Korea.svg.png`
  },
  Japan: {    name: `Japan`,
    description: `Located in the Pacific Ocean, it lies off the eastern coast of the Asian mainland, and stretches from the Sea of Okhotsk in the north to the East China Sea and Taiwan in the southwest.`,
    image: `https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/900px-Flag_of_Japan.svg.png`
  },
  Moon: {    name: `Moon Jae-In`,
    description: `The 12th and current President of South Korea. Formally, he is also considered the 19th President of South Korea based on the number of presidential terms in the country's history.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/2/21/Moon_Jae-in_May_2017.jpg`
  },
  KCNA: {    name: `Korean Central News Agency`,
    description: `The Korean Central News Agency (KCNA) is the state news agency of North Korea that was established on December 5, 1946. The agency portrays the views of the North Korean government for foreign consumption.`,
    image: `https://upload.wikimedia.org/wikipedia/en/4/43/Korean_Central_News_Agency_logo.png`
  },
  White_House: {    name: `White House`,
    description: `The White House is the official residence and workplace of the President of the United States, located at 1600 Pennsylvania Avenue NW in Washington, D.C. It has been the residence of every U.S. president since John Adams in 1800.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/White_House_north_and_south_sides.jpg/1280px-White_House_north_and_south_sides.jpg`
  },
  Donald_Trump: {
    name: `Donald Trump`,
    description: `Donald John Trump (born June 14, 1946) is the 45th and current President of the United States. Before entering politics he was a businessman and television personality.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/1280px-Donald_Trump_official_portrait.jpg`
  },
  Barack_Obama: {
    name: `Barack_Obama`,
    description: `an American politician who served as the 44th President of the United States from 2009 to 2017. He is the first African American to have served as president. He previously served in the U.S. Senate representing Illinois from 2005 to 2008, and in the Illinois State Senate from 1997 to 2004.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/1280px-President_Barack_Obama.jpg`
  },
  Park: {
    name: `Park Geun-hye`,
    description: `a South Korean former politician who served as the 11th President of South Korea from 2013 to 2017.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/4/40/Park_Geun-hye_%288724400493%29_%28cropped%29.jpg`
  },
  Lee: {
    name: `Lee Myung-bak`,
    description: `South Korean politician and businessman who served as the 10th President of South Korea from 25 February 2008 to 25 February 2013. Before his election as president, he was the CEO of Hyundai Engineering and Construction, as well as the mayor of Seoul from 1 July 2002, to 30 June 2006. `,
    image: `https://upload.wikimedia.org/wikipedia/commons/7/72/Sebasti%C3%A1n_Pi%C3%B1era_-_Lee_Myung-bak_%28cropped%29.jpg`
  },
  Reuters: {
    name: `Reuters`,
    description: `Reuters /ˈrɔɪtərz/ is an international news agency headquartered in London, England. It is a division of Thomson Reuters.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Reuters-Building-30SC.JPG/1920px-Reuters-Building-30SC.JPG`
  },
  Seventh_Avenue: {
    name: `Seventh Avenue`,
    description: `Seventh Avenue – known as Adam Clayton Powell Jr. Boulevard north of Central Park – is a thoroughfare on the West Side of the borough of Manhattan in New York City. It is southbound below Central Park and a two-way street north of the park.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Times_Square_1-2.JPG/1920px-Times_Square_1-2.JPG`
  },
  Village_Vanguard: {
    name: `Village Vanguard`,
    description: `The Village Vanguard is a jazz club located at Seventh Avenue South in Greenwich Village, New York City.[1] The club was opened on February 22, 1935, by Max Gordon. `,
    image: `https://upload.wikimedia.org/wikipedia/commons/c/c1/The_Village_Vanguard_at_night_1976.jpg`
  },
  Greenwich_Village: {
    name: `Greenwich Village`,
    description: `Greenwich Village,[note 1] often referred to by locals as simply "the Village", is a neighborhood on the west side of Lower Manhattan, New York City. `,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/West_4th_and_West_12th_Intersection.JPG/1920px-West_4th_and_West_12th_Intersection.JPG`,
  },
  CMS: {
    name: `Cécile McLorin Salvant`,
    description: `Cécile McLorin Salvant (born 1989) is an American jazz vocalist. She was the winner of the first prize in the Thelonious Monk International Jazz Competition in 2010, releasing her first album, Cecile, shortly thereafter.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/d/d1/C%C3%A9cile_McLorin_Salvant.jpg`,
  },
  Grammy: {
    name: `Grammy Award`,
    description: `A Grammy Award (originally called Gramophone Award), or Grammy, is an honor awarded by The Recording Academy to recognize outstanding achievement in the mainly English-language music industry.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ted_Jensen%27s_2002_Grammy.jpg/1920px-Ted_Jensen%27s_2002_Grammy.jpg`,
  },
  Issey_Miyake: {
    name: `Issey Miyake`,
    description: `Issey Miyake (三宅 一生? Miyake Issei[pronunciation?], born 22 April 1938) is a Japanese fashion designer. He is known for his technology-driven clothing designs.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Issey_Miyake_Tokyo_2016.jpg/440px-Issey_Miyake_Tokyo_2016.jpg`,
  },
  Sonny_Rollins: {
    name: `Sonny Rollins`,
    description: `Walter Theodore "Sonny" Rollins (born September 7, 1930) is an American jazz tenor saxophonist, widely recognized as one of the most important and influential jazz musicians.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/4/40/Sonny_Rollins_2011.jpg`,
  },
  Dexter_Gordon: {
    name: `Dexter Gordon`,
    description: `Dexter Gordon (February 27, 1923 – April 25, 1990) was an American jazz tenor saxophonist. He was among the earliest tenor players to adapt the bebop musical language`,
    image: `https://upload.wikimedia.org/wikipedia/commons/f/fa/Dexter_Gordon1.jpg`,
  },
  Charlie_Haden: {
    name: `Charlie Haden`,
    description: `Charles Edward "Charlie" Haden (August 6, 1937 – July 11, 2014) was an American jazz double bass player, bandleader, composer and educator known for his deep, warm sound, and whose career spanned more than fifty years.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/e/ed/Charlie_Haden_1981.jpg`,
  },
  Irving_Berlin: {
    name: `Irving Berlin`,
    description: `Irving Berlin (born Israel Isidore Baline; May 11, 1888 – September 22, 1989) was an American composer and lyricist, widely considered one of the greatest songwriters in American history. His music forms a great part of the Great American Songbook.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/d/da/BerlinPortrait1.jpg`,
  },
  Bessie_Smith: {
    name: `Bessie Smith`,
    description: `Bessie Smith (April 15, 1894 – September 26, 1937) was an American blues singer. Nicknamed the Empress of the Blues, she was the most popular female blues singer of the 1920s and 1930s.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bessie_Smith_%281936%29_by_Carl_Van_Vechten.jpg/1280px-Bessie_Smith_%281936%29_by_Carl_Van_Vechten.jpg`,
  },
  Kurt_Weill: {
    name: `Kurt Weill`,
    description: `Kurt Julian Weill (March 2, 1900 – April 3, 1950) was a German composer, active from the 1920s in his native country, and in his later years in the United States. He was a leading composer for the stage who was best known for his fruitful collaborations with Bertolt Brecht.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/0/05/Bundesarchiv_Bild_146-2005-0119%2C_Kurt_Weill.jpg`,
  },
  Langston_Hughes: {
    name: `Langston Hughes`,
    description: `James Mercer Langston Hughes (February 1, 1902 – May 22, 1967) was an American poet, social activist, novelist, playwright, and columnist from Joplin, Missouri. He was one of the earliest innovators of the then-new literary art form called jazz poetry.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/2/21/Langston_Hughes_by_Carl_Van_Vechten_1936.jpg`,
  },
  Wynton_Marsalis: {
    name: `Wynton Marsalis`,
    description: `Wynton Learson Marsalis (born October 18, 1961) is a trumpeter, composer, teacher, music educator, and artistic director of Jazz at Lincoln Center in New York City, United States.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/d/da/Wynton_Marsalis_2009_09_13.jpg`
  },
  JLCO: {
    name: `Jazz at Lincoln Center Orchestra`,
    description: `The Jazz at Lincoln Center Orchestra (JLCO) is an American professional big band that is produced by Jazz at Lincoln Center, a major performing arts institution structured as a non-profit organization that is housed in its own facility at the Time Warner Center in Manhattan, New York.`,
    image: `https://www.allaboutjazz.com/media/medium/c/1/b/ac5e092ca4a66272dd3ea1f7ca454.jpg`
  },
  MJ: {
    name: `Michael Jordan`,
    description: `Michael Jeffrey Jordan (born February 17, 1963), also known by his initials, MJ, is an American retired professional basketball player, businessman, and principal owner and chairman of the Charlotte Hornets.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg`
  },
  Miami: {
    name: `Miami`,
    description: `Miami (/maɪˈæmi/; Spanish pronunciation: [miˈami]) is a seaport city at the southeastern corner of the U.S. state of Florida and its Atlantic coast. As the seat of Miami-Dade County, the municipality is the principal, central, and the most populous city of the Miami metropolitan area and part of the second-most populous metropolis in the southeastern United States.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Miami_collage_20110330.jpg/1024px-Miami_collage_20110330.jpg`
  },
  Senegalese: {
    name: `Senegalese`,
    description: `Senegal (Listeni/ˌsɛnᵻˈɡɔːl, -ˈɡɑːl/; French: Sénégal), officially the Republic of Senegal (French: République du Sénégal [ʁepyblik dy seneɡal]), is a country in West Africa. Senegal is bordered by Mauritania in the north, Mali to the east, Guinea to the southeast, and Guinea-Bissau to the southwest.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/900px-Flag_of_Senegal.svg.png`
  },
  Charlotte_Church: {
    name: `Charlotte Church`,
    description: `Charlotte Maria Church (born 21 February 1986) is a Welsh singer-songwriter, actress and television presenter. She rose to fame in childhood as a classical singer before branching into pop music in 2005.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/b/b2/Charlotte_Church_Focus_Wales_2013.jpg`
  },
  Harlem: {
    name: `Harlem`,
    description: `Harlem is a large neighborhood in the northern section of the New York City borough of Manhattan. Since the 1920s, Harlem has been known as a major African-American residential, cultural and business center. Originally a Dutch village, formally organized in 1658.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/a/a6/Harlem_04.jpg`
  },
  Sarah_Vaughan: {
    name: `Sarah Vaughan`,
    description: `Sarah Lois Vaughan (March 27, 1924 – April 3, 1990) was an American jazz singer, described by music critic Scott Yanow as having "one of the most wondrous voices of the 20th century."`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Sarah_Vaughan_-_William_P._Gottlieb_-_No._1.jpg/1280px-Sarah_Vaughan_-_William_P._Gottlieb_-_No._1.jpg`
  },
  Haitian: {
    name: 'Haitian',
    description: `Haiti, officially the Republic of Haiti (French: République d'Haïti; Haitian Creole: Repiblik Ayiti) and formerly called Hayti, is a country located on the island of Hispaniola in the Greater Antilles archipelago of the Caribbean Sea.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/500px-Flag_of_Haiti.svg.png`
  },
  France: {
    name: `France`,
    description: `France, officially the French Republic, is a country with territory in western Europe and several overseas regions and territories. The European, or metropolitan, area of France extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean.`,
    image: `https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/900px-Flag_of_France.svg.png`
  },
  DMC: {
    name: `Darius Milhaud Conservatory`,
    description: `Listed since 1884 in the category of National Schools of Music and Dance, the Conservatory was awarded the label of Conservatoire à rayonnement Départemental (C.R.D.) in 2007, and was named after the great Aix composer Darius Milhaud in 1972.`,
    image: `http://images.adsttc.com/media/images/53b4/f334/c07a/8037/7200/00a6/large_jpg/RH2266-0046.jpg?1404367656`
  },
  AeP: {
    name: `Aix-en-Provence`,
    description: `a city-commune in the south of France, about 30 km (19 mi) north of Marseille. It is in the region of Provence-Alpes-Côte d'Azur, in the department of Bouches-du-Rhône, of which it is a subprefecture.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Aix-en-Provence_20110930_12.jpg/2560px-Aix-en-Provence_20110930_12.jpg`
  },
  JFB: {
    name: `Jean-François Bonnel`,
    description: `Musical instructor of Cécile McLorin Salvant.`,
    image: `http://www.jazzenprovence.com/wp-content/uploads/2012/10/musicien_bonnel_jean_franco.jpg`
  },
  Saint_Tropez: {
    name: `Saint-Tropez`,
    description: `a town, 100 kilometres (62 miles) west of Nice, in the Var department of the Provence-Alpes-Côte d'Azur region of southeastern France. It is also the principal town in the canton of Saint-Tropez.`,
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Saint_Tropez_Ville.jpg/1920px-Saint_Tropez_Ville.jpg`
  },
  Kris_Wang: {
    name: `Kris Wang`,
    description: `Kris Wang is an American politician and a former mayor of Cupertino, California.`,
    image: ``
  },
  California: {
    name: `California`,
    description: `California (/ˌkælᵻˈfɔːrnjə, -ni.ə/ KAL-ə-FORN-yə, KAL-ə-FORN-ee-ə) is the most populous state in the United States and the third most extensive by area. Located on the western (Pacific Ocean) coast of the U.S., California is bordered by the other U.S`,
    image: ``
  },
  Mountain_View: {
    name: `Mountain View`,
    description: `Mountain View may refer to any of the following places:`,
    image: ``
  },
  Steve_Jobs: {
    name: `Steve Jobs`,
    description: `Steven Paul "Steve" Jobs (/ˈdʒɒbz/; February 24, 1955 – October 5, 2011) was an American entrepreneur, businessman, inventor, and industrial designer. He was the co-founder, chairman, and chief executive officer (CEO) of Apple Inc.; CEO and majority `,
    image: `https://upload.wikimedia.org/wikipedia/commons/b/b9/Steve_Jobs_Headshot_2010-CROP.jpg`
  },
  Apple: {
    name: `https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg`,
    description: `The apple tree (Malus pumila, commonly and erroneously called Malus domestica) is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple. It is cultivated worldwide as a fruit tree, and is the most widely grown speci`,
    image: ``
  },
  Jonathan_Ive: {
    name: `Jonathan Ive`,
    description: `Sir Jonathan Paul "Jony" Ive, KBE (born 27 February 1967), is a British industrial designer who is currently the Chief Design Officer (CDO) of Apple Inc. While working for a design firm in London he was asked by Apple, then a struggling company, to c`,
    image: `https://upload.wikimedia.org/wikipedia/commons/7/7d/Jonathan_Ive_%28OTRS%29.jpg`
  },
  Jeep: {
    name: `Jeep Wrangler`,
    description: `The Jeep Wrangler is a compact and mid-size (Wrangler Unlimited models) four-wheel drive off-road vehicle manufactured by Jeep, currently in its third generation. The Wrangler is arguably an indirect progression from the World War II Willys MB throug`,
    image: `https://upload.wikimedia.org/wikipedia/commons/a/a6/2008_Wrangler_JK_Unlimited_Sahara.jpg`
  },
  Apple_Park: {
    name: `Apple Park`,
    description: `Apple Park is the future headquarters of Apple Inc. in Cupertino, California. It is under construction and was expected to be completed by the end of 2017. Its research and development facility is already occupied with over 2000 people. It is going t`,
    image: `https://upload.wikimedia.org/wikipedia/commons/6/61/Apple_Campus_2_aerial_Aug_2016.jpg`
  },
  Jurassic: {
    name: `Jurassic Park`,
    description: `Jurassic Park is an American science fiction media franchise centered on a disastrous attempt to create a theme park of cloned dinosaurs. It began in 1990 when Universal Studios bought the rights to the novel by Michael Crichton before it was even pu`,
    image: `https://upload.wikimedia.org/wikipedia/en/9/96/Jurassic_Park_logo.jpg`
  },
  YouTube: {
    name: `YouTube`,
    description: `YouTube is an American video-sharing website headquartered in San Bruno, California. The service was created by three former PayPal employees – Chad Hurley, Steve Chen, and Jawed Karim – in February 2005. Google bought the site in November 2006 for U`,
    image: ``
  },
  New_Age: {
    name: `New Age`,
    description: `The New Age is a term applied to a range of spiritual or religious beliefs and practices that developed in Western nations during the 1970s. Precise scholarly definitions of the New Age differ in their emphasis, largely as a result of its highly ecle`,
    image: ``
  },
  Kansas: {
    name: `Kansas`,
    description: `Kansas /ˈkænzəs/ is a U.S. state located in the Midwestern United States. Its capital is Topeka and its largest city is Wichita. Kansas is named after the Kansa Native American tribe, which inhabited the area. The tribe's name (natively kką:ze) is of`,
    image: ``
  },
  Yosemite: {
    name: `Yosemite`,
    description: `Yosemite National Park (/joʊˈsɛmᵻti/ yoh-SEM-it-ee) is a national park spanning portions of Tuolumne, Mariposa and Madera counties in Northern California. The park, which is managed by the National Park Service, covers an area of 747,956 acres (1,168`,
    image: ``
  },
  Lincoln_Tunnel: {
    name: `Lincoln Tunnel`,
    description: `The Lincoln Tunnel is an approximately 1.5-mile-long (2.4 km) set of three tunnels under the Hudson River, connecting Weehawken, New Jersey and Midtown Manhattan in New York City. An integral conduit within the New York Metropolitan Area, it was desi`,
    image: `https://upload.wikimedia.org/wikipedia/commons/1/12/Lincolntunnel.jpg`
  },
  SFO: {
    name: `SFO`,
    description: `San Francisco International Airport (IATA: SFO, ICAO: KSFO, FAA LID: SFO) is an international airport 13 miles (21 km) south of downtown San Francisco, California, United States, near Millbrae and San Bruno in unincorporated San Mateo County. It has `,
    image: `https://upload.wikimedia.org/wikipedia/commons/c/c0/SFO_Logo.svg`
  },
  Silicon_Valley: {
    name: `Silicon Valley`,
    description: `Silicon Valley is a nickname for the southern portion of the San Francisco Bay Area, in the northern part of the U.S. state of California. The "valley" in its name refers to the Santa Clara Valley in Santa Clara County, which includes the city of San`,
    image: ``
  },
  Dan_Whisenhunt: {
    name: `Dan Whisenhunt`,
    description: ``,
    image: ``
  },
  Cupertino: {
    name: `Cupertino`,
    description: `Cupertino (/ˌkuːpərˈtiːnoʊ/ KOOP-ər-TEEN-oh) is a U.S. city in Santa Clara County, California, directly west of San Jose on the western edge of the Santa Clara Valley with portions extending into the foothills of the Santa Cruz Mountains. The populat`,
    image: ``
  },
  Infinite_Loop: {
    name: `Infinite Loop`,
    description: `An infinite loop (or endless loop) is a sequence of instructions in a computer program which loops endlessly, either due to the loop having no terminating condition, having one that can never be met, or one that causes the loop to start over. In olde`,
    image: ``
  },
  Hyde_Park: {
    name: `Hyde Park`,
    description: `Hyde Park may refer to:`,
    image: ``
  },
  Norman_Foster: {
    name: `Norman Foster`,
    description: `Norman Robert Foster, Baron Foster of Thames Bank, OM, HonFREng (born 1 June 1935) is a British architect whose company, Foster + Partners, maintains an international design practice famous for high-tech architecture. He is one of Britain's most prol`,
    image: `https://upload.wikimedia.org/wikipedia/commons/a/a6/Norman_Foster_dresden_061110.jpg`
  },
  Pritzker: {
    name: `Pritzker Prize`,
    description: `The Pritzker Architecture Prize is awarded annually "to honor a living architect or architects whose built work demonstrates a combination of those qualities of talent, vision and commitment, which has produced consistent and significant contribution`,
    image: `https://upload.wikimedia.org/wikipedia/en/f/f0/Medal_of_Pritzker_Architecture_Prize_%28front%29.gif`
  },
  Berlin: {
    name: `Berlin Reichstag`,
    description: ``,
    image: ``
  },
  Hong_Kong: {
    name: `Hong Kong`,
    description: `Hong Kong, officially the Hong Kong Special Administrative Region of the People's Republic of China, is an autonomous territory on the Pearl River Delta of China. Macau lies across the delta to the west, and the province of Guangdong borders the terr`,
    image: ``
  },
  Palo_Alto: {
    name: `Palo Alto`,
    description: `Palo Alto (/ˌpæloʊ ˈæltoʊ/ PAL-oh AL-toh; Spanish: [ˈpalo ˈalto]; from palo, literally "stick", colloquially "tree", and alto "tall"; meaning: "tall tree") is a charter city located in the northwest corner of Santa Clara County, California, in the Sa`,
    image: ``
  },
  Foster_Partners: {
    name: `Foster Partners`,
    description: `Foster + Partners is a British international studio for architecture and integrated design, with headquarters in London. The practice is led by its founder and Chairman, Norman Foster, and has constructed many high-profile glass-and-steel buildings.`,
    image: `https://upload.wikimedia.org/wikipedia/en/e/eb/Foster_and_Partners_logo.gif`
  },
  Stefan_Behling: {
    name: `Stefan Behling`,
    description: ``,
    image: ``
  },
  Stanford: {
    name: `Stanford`,
    description: `Stanford University (Stanford; officially Leland Stanford Junior University) is a private research university in Stanford, California, adjacent to Palo Alto and between San Jose and San Francisco. Its 8,180-acre (12.8 sq mi; 33.1 km2) campus is one o`,
    image: `https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg`
  },
  Phillip_Glass: {
    name: `Phillip Glass`,
    description: `Philip Morris Glass (born January 31, 1937) is an American composer. He is considered one of the most influential music makers of the late 20th century. Glass's compositions have been described as minimal music, similar to other "minimalist" composer`,
    image: `https://upload.wikimedia.org/wikipedia/commons/5/5b/Philip_Glass_018.jpg`
  },
  Pixar: {
    name: `Pixar`,
    description: ``,
    image: `https://upload.wikimedia.org/wikipedia/commons/2/21/Pixaranimationstudios.jpg`
  },
  Möbius: {
    name: `Möbius`,
    description: `Moebius, Möbius or Mobius may refer to:`,
    image: ``
  },
  HP: {
    name: `HP`,
    description: `HP may refer to: Hewlett-Packard, a former technology corporation that split into two separate companies in 2015: Hewlett Packard Enterprise, an enterprise-focused product and service organization HP Inc., Hewlett-Packard's computer and printer busin`,
    image: ``
  },
  Walter_Isaacson: {
    name: `Walter Isaacson`,
    description: `Walter Isaacson (born May 20, 1952) is an American writer and journalist. He is the President and CEO of the Aspen Institute, a nonpartisan educational and policy studies organization based in Washington, D.C. He has been the chairman and CEO of Cabl`,
    image: `https://upload.wikimedia.org/wikipedia/commons/7/78/Walter_Isaacson_VF_2012_Shankbone_2.JPG`
  },
  Lebowski: {
    name: `The Big Lebowski`,
    description: ``,
    image: ``
  },
  Menlo: {
    name: `Menlo Park`,
    description: `Menlo Park may refer to: Menlo Park, New Jersey, an unincorporated community in the United States Menlo Park, California, a city in the United States Menlo Park, Pretoria, a suburb in South Africa Menlo Park (band), an alternative-rock band Menlo Par`,
    image: ``
  },
  Tim_Cook: {
    name: `Tim Cook`,
    description: `Timothy Donald "Tim" Cook (born November 1, 1960) is an American business executive, industrial engineer and developer. Cook is the Chief Executive Officer of Apple Inc., previously serving as the company's Chief Operating Officer, under its founder `,
    image: ``
  },
  Remember: {
    name: `Remember the Titans`,
    description: ``,
    image: `https://upload.wikimedia.org/wikipedia/en/d/d1/Remember_the_titansposter.jpg`
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
    },
    415: {
      scene_id: scenes.CMS1.id,
      actor_id: actors.Seventh_Avenue.id
    },
    416: {
      scene_id: scenes.CMS1.id,
      actor_id: actors.Village_Vanguard.id
    },
    417: {
      scene_id: scenes.CMS1.id,
      actor_id: actors.Greenwich_Village.id
    },
    418: {
      scene_id: scenes.CMS1.id,
      actor_id: actors.CMS.id
    },
    419: {
      scene_id: scenes.CMS1.id,
      actor_id: actors.Grammy.id
    },
    520: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Issey_Miyake.id
    },
    521: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Sonny_Rollins.id
    },
    522: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Dexter_Gordon.id
    },
    523: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Charlie_Haden.id
    },
    524: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Irving_Berlin.id
    },
    525: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Bessie_Smith.id
    },
    526: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Kurt_Weill.id
    },
    527: {
      scene_id: scenes.CMS2.id,
      actor_id: actors.Langston_Hughes.id
    },
    628: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.Wynton_Marsalis.id
    },
    629: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.JLCO.id
    },
    630: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.MJ.id
    },
    631: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.Miami.id
    },
    632: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.Senegalese.id
    },
    633: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.Charlotte_Church.id
    },
    634: {
      scene_id: scenes.CMS3.id,
      actor_id: actors.Harlem.id
    },
    735: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.Sarah_Vaughan.id
    },
    736: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.Haitian.id
    },
    737: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.France.id
    },
    738: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.DMC.id
    },
    739: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.AeP.id
    },
    740: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.JFB.id
    },
    741: {
      scene_id: scenes.CMS4.id,
      actor_id: actors.Saint_Tropez.id
    },
    81: {
      scene_id: scenes.A1.id,
      actor_id: actors.Cupertino.id
    },
    82: {
      scene_id: scenes.A1.id,
      actor_id: actors.Kris_Wang.id
    },
    83: {
      scene_id: scenes.A1.id,
      actor_id: actors.California.id
    },
    84: {
      scene_id: scenes.A1.id,
      actor_id: actors.Mountain_View.id
    },
    85: {
      scene_id: scenes.A1.id,
      actor_id: actors.Steve_Jobs.id
    },
    86: {
      scene_id: scenes.A1.id,
      actor_id: actors.Apple.id
    },
    91: {
      scene_id: scenes.A2.id,
      actor_id: actors.Jonathan_Ive.id
    },
    92: {
      scene_id: scenes.A2.id,
      actor_id: actors.Jeep.id
    },
    93: {
      scene_id: scenes.A2.id,
      actor_id: actors.Apple_Park.id
    },
    94: {
      scene_id: scenes.A2.id,
      actor_id: actors.Jurassic.id
    },
    95: {
      scene_id: scenes.A2.id,
      actor_id: actors.YouTube.id
    },
    96: {
      scene_id: scenes.A2.id,
      actor_id: actors.New_Age.id
    },
    97: {
      scene_id: scenes.A2.id,
      actor_id: actors.Kansas.id
    },
    98: {
      scene_id: scenes.A2.id,
      actor_id: actors.Yosemite.id
    },
    99: {
      scene_id: scenes.A2.id,
      actor_id: actors.Lincoln_Tunnel.id
    },
    101: {
      scene_id: scenes.A3.id,
      actor_id: actors.SFO.id
    },
    102: {
      scene_id: scenes.A3.id,
      actor_id: actors.Silicon_Valley.id
    },
    103: {
      scene_id: scenes.A3.id,
      actor_id: actors.Dan_Whisenhunt.id
    },
    104: {
      scene_id: scenes.A3.id,
      actor_id: actors.Apple.id
    },
    111: {
      scene_id: scenes.A4.id,
      actor_id: actors.Cupertino.id
    },
    112: {
      scene_id: scenes.A4.id,
      actor_id: actors.Infinite_Loop.id
    },
    113: {
      scene_id: scenes.A4.id,
      actor_id: actors.Hyde_Park.id
    },
    114: {
      scene_id: scenes.A4.id,
      actor_id: actors.Norman_Foster.id
    },
    115: {
      scene_id: scenes.A4.id,
      actor_id: actors.Pritzker.id
    },
    116: {
      scene_id: scenes.A4.id,
      actor_id: actors.Berlin.id
    },
    117: {
      scene_id: scenes.A4.id,
      actor_id: actors.Hong_Kong.id
    },
    118: {
      scene_id: scenes.A4.id,
      actor_id: actors.Palo_Alto.id
    },
    119: {
      scene_id: scenes.A4.id,
      actor_id: actors.Foster_Partners.id
    },
    1110: {
      scene_id: scenes.A4.id,
      actor_id: actors.Stefan_Behling.id
    },
    1111: {
      scene_id: scenes.A4.id,
      actor_id: actors.Stanford.id
    },
    121: {
      scene_id: scenes.A5.id,
      actor_id: actors.Phillip_Glass.id
    },
    122: {
      scene_id: scenes.A5.id,
      actor_id: actors.Pixar.id
    },
    123: {
      scene_id: scenes.A5.id,
      actor_id: actors.Möbius.id
    },
    131: {
      scene_id: scenes.A6.id,
      actor_id: actors.HP.id
    },
    132: {
        scene_id: scenes.A6.id,
        actor_id: actors.Walter_Isaacson.id
      },
    133: {
        scene_id: scenes.A6.id,
        actor_id: actors.Dan_Whisenhunt.id
      },
    134: {
        scene_id: scenes.A6.id,
        actor_id: actors.Cupertino.id
      },
    135: {
        scene_id: scenes.A6.id,
        actor_id: actors.Lebowski.id
      },
    136: {
        scene_id: scenes.A6.id,
        actor_id: actors.Menlo.id
      },
    137: {
        scene_id: scenes.A6.id,
        actor_id: actors.Tim_Cook.id
      },
    138: {
      scene_id: scenes.A6.id,
      actor_id: actors.Remember.id
    }
  })
)

const maps = seed(Map, {
  North_Korea_Map: {
    coords: `127.510093, 40.339852`,
    zoom: 3,
    style: 'satellite'
  },
  Pyongyang_map: {
    coords: `125.7625241, 39.0392193`,
    zoom: 12,
    style: `satellite`
  },
  Village_Vanguard_map: {
    coords: `-74.00168649999999, 40.7360303`,
    zoom: 17,
    style: `outdoors`
  },
  JLC_map: {
    coords: `-73.9828793, 40.7686999`,
    zoom: 14,
    style: `outdoors`
  },
  France_map: {
    coords: `5.4394361, 43.5256738`,
    zoom: 8,
    style: `outdoors`
  },
  Cupertino_map: {
    coords: `-122.0321823, 37.3229978`,
    zoom: 12,
    style: `light`
  },
  SF_map: {
    coords: `-122.4194155, 37.7749295`,
    zoom: 7,
    style: `satellite`
  },
  Apple_map: {
    coords: `-122.010984, 37.33502`,
    zoom: 17,
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
    },
    53: {
      scene_id: scenes.CMS2.id,
      map_id: maps.Village_Vanguard_map.id
    },
    64: {
      scene_id: scenes.CMS3.id,
      map_id: maps.JLC_map.id
    },
    75: {
      scene_id: scenes.CMS4.id,
      map_id: maps.France_map.id
    },
    1111: {
      scene_id: scenes.A1.id,
      map_id: maps.Cupertino_map.id
    },
    4242: {
      scene_id: scenes.A4.id,
      map_id: maps.SF_map.id
    },
    5353: {
      scene_id: scenes.A5.id,
      map_id: maps.Apple_map.id
    }
  })
)

module.exports = Object.assign(seed, {users, stories, scenes, actors, maps, scenesActors, scenesMaps})


