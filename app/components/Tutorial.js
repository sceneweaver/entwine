import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { browserHistory } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Tutorial extends React.Component {

  onStartClick() {
    browserHistory.push('/editor');
  }

  render() {
    let tutorialbg = '#4d194d';
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
              media={<img />}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(APP/public/images/tutorial-1.png)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Step 1: Write your first scene"
              subtitle="Articles can have multiple sections (aka scenes). Add bold or blockquote styling to text using the buttons above. Common keyboard shortcuts like ctrl-z or cmd-z will also work."
            />
            <Slide
              media={<img />}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(APP/public/images/tutorial-2.png)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Step 2: Add Characters"
              subtitle="Once you've written something, click on the Characters button. Then, press generate to add key characters to your story. You can edit descriptions or add images manually."
            />
            <Slide
              media={<img />}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(APP/public/images/tutorial-3.png)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Step 3: Add a Map or a Header Image"
              subtitle="Each scene can have either a header or a map. In the header module, type in a keyword on the left and search for an image to use, or use your own on the right."
            />
             <Slide
              media={<img />}
              mediaBackgroundStyle={{backgroundSize: 'cover', backgroundImage: `url(APP/public/images/tutorial-4.png)`}}
              contentStyle={{ backgroundColor: tutorialbg }}
              title="Step 4: Add More Scenes and Publish!"
              subtitle="After you finish all of your scenes, title your story as well as each scene. Click publish on top left to see your completed story!"
            />
          </AutoRotatingCarousel>
        </div>
      </MuiThemeProvider>
    );
  }


}

/* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux';

const mapState = () => ({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Tutorial);
