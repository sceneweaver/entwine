import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel'
import { green400, green600, blue400, blue600, red400, red600 } from 'material-ui/styles/colors'

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { browserHistory } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Tutorial extends React.Component {

  onStartClick() {
    browserHistory.push('/editor')
  }

  render() {
    let tutorialbg = '#4d194d'
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BaseTheme)}>
        <div>
          <AutoRotatingCarousel
            label="Try it yourself"
            autoplay={false}
            onStart={this.onStartClick}
            open
          >
            <Slide
              media={<img></img>}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(APP/public/images/tutorial-1.png)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Write your first scene"
              subtitle="Articles written with entwine have multiple scenes, which are like chapters. As you're writing, you can use the rich text buttons above to add bold or block quote styling to your text. Keyboard shorcuts like ctrl-z (pc) or cmd-z (mac) work as well."
            />
            <Slide
              media={<img></img>}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(https://www.rented.com/content/images/2016/02/photo-1415201364774-f6f0bb35f28f.jpg)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Ever wanted to be popular?"
              subtitle="Well just mix two colors and your are good to go!"
            />
            <Slide
              media={<img src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png" />}
              mediaBackgroundStyle={{ backgroundColor: green400 }}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="May the force be with you"
              subtitle="The Force is a metaphysical and ubiquitous power in the Star Wars universe."
            />
             <Slide
              media={<img src="http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png" />}
              mediaBackgroundStyle={{ backgroundColor: blue400 }}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Ever wanted to be popular?"
              subtitle="Well just mix two colors and your are good to go!"
            />
          </AutoRotatingCarousel>
        </div>
      </MuiThemeProvider>
    )
  }


}

/* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux';

const mapState = () => ({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Tutorial);
