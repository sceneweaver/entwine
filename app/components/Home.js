import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const Home = () => (
  <div className="home home-margin">
    <div className="row flex">

      <Link to="stories/1">
        <div className="featured-card hoverable" style={{backgroundImage: `url(https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-0.3.5&q=100&fm=jpg&crop=entropy&cs=tinysrgb&s=f9835518115e48ae328a33890fc683d6)`}}>
          <div>
            <h1>
              <b>Featured Story:</b> Cécile McLorin Salvant's Timeless Jazz
            </h1>
            <h2>
              Fred Kaplan
            </h2>
          </div>
        </div>
      </Link>

      <div className="about-card hoverable">
        <span> entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories. </span>
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
