import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const Home = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <div className="home main-featured container">
      <div className="row feature-row">
        <div className="featured-card col-md-8">
          <RaisedButton containerElement={<Link to="stories/featured" />}>
            <Card >
              <CardMedia
                overlay={<CardTitle title="Featured Story" subtitle="James Comey's Conspicuous Independence" style={{'text-align': 'left'}}/>}
              >
                <img height="400px" src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
              </CardMedia>
            </Card>
          </RaisedButton>
        </div>
        <div className="col-md-4 about">
          <Card>
            <CardMedia>
            </CardMedia>
            <CardText style={{fontSize: 25}}>entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories.</CardText>
            <div className="create-story-button">
              <RaisedButton label="Create a Story Now" fullWidth={true} labelStyle={{'font-size': 22}} containerElement={<Link to="/editor"/>} />
            </div>
          </Card>
        </div>
      </div>

      <div className="row small-featured-stories feature-row">
        <div className="col-md-3">
          <Card>
            <CardMedia
              overlay={<CardTitle title="Featured Story" />}
            >
            <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </CardMedia>
          </Card>
          </div>
          <div className="col-md-3">
          <Card>
            <CardMedia
              overlay={<CardTitle title="Featured Story" />}
            >
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </CardMedia>
          </Card>
        </div>
        <div className="col-md-3">
          <Card>
            <CardMedia
              overlay={<CardTitle title="Featured Story" />}
            >
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </CardMedia>
          </Card>
        </div>
        <div className="col-md-3">
          <Card>
            <CardMedia
              overlay={<CardTitle title="Featured Story" />}
            >
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </CardMedia>
          </Card>
        </div>
      </div>
    </div>
  </MuiThemeProvider>
);

export default Home;
