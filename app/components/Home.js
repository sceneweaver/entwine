import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const Home = () => (
  <div className="home home-margin">
    <div className="row">

      <div className="col s12 m8 main-featured">
        <div className="card hoverable">
          <div className="card-image">
            <Link to="stories/featured">
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </Link>
          </div>
          <div className="card-content lime lighten-5">
            <span className="card-title">Card Title</span>
            <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
          </div>
        </div>
      </div>

      <div className="col s12 m4 about-card">
        <div className="card hoverable blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Card Title</span>
            <p>entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories.</p>
          </div>
          <div className="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>

    </div>

    <div className="row">
       <div className="col s12 m6">
        <div className="card hoverable">
          <div className="card-image">
            <Link to="stories/1">
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </Link>
          </div>
          <div className="card-content lime lighten-5">
            <span className="card-title">Card Title</span>
            <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
          </div>
        </div>
      </div>

      <div className="col s12 m6">
        <div className="card hoverable">
          <div className="card-image">
            <Link to="stories/1">
              <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
            </Link>
          </div>
          <div className="card-content lime lighten-5">
            <span className="card-title">Card Title</span>
            <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default Home;


<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <div className="home main-featured container">
      <div className="row feature-row">
        <div className="featured-card col-sm-12 col-md-8">
          <RaisedButton containerElement={<Link to="stories/featured" />}>
            <Card >
              <CardMedia
                overlay={<CardTitle title="Featured Story: James Comey's Conspicuous Independence" subtitle="by Peter Elkind" style={{textAlign: 'left'}}/>}
              >
                <img height="400px" src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
              </CardMedia>
            </Card>
          </RaisedButton>
        </div>
        <div className="about col-sm-12 col-md-4">
          <Card>
            <CardMedia>
            </CardMedia>
            <CardText style={{fontSize: 25}}>entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories.</CardText>
            <div className="create-story-button">
              <RaisedButton label="Create a Story Now" fullWidth={true} labelStyle={{fontSize: 22}} containerElement={<Link to="/editor"/>} />
            </div>
          </Card>
        </div>
      </div>

      <div className="row small-featured-stories feature-row">
        <div className="col-sm-12 col-md-6">
            <RaisedButton containerElement={<Link to="stories/1" />}>
              <Card>
                <CardMedia
                  overlay={<CardTitle title="North Korea's Apocalyptic Propagandists" subtitle="by Hannah Beech" style={{textAlign: 'left'}}/>}
                >
                <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
                </CardMedia>
              </Card>
            </RaisedButton>
          </div>
          <div className="col-sm-12 col-md-6">
             <RaisedButton containerElement={<Link to="stories/featured" />}>
              <Card>
                <CardMedia
                  overlay={<CardTitle title="Ai Wei Wei's Life Story" subtitle="by Emily Tseng" style={{textAlign: 'left'}}/>}
                >
                  <img src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
                </CardMedia>
              </Card>
             </RaisedButton>
          </div>
      </div>
    </div>
  </MuiThemeProvider>
