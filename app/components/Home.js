import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


const Home = () => (
  <div >
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
  <div className="home main-featured container">
    <div className="row feature-row">

      <div className="featured-card col-md-8">
      <Card>
        <CardMedia
          overlay={<CardTitle title="Featured Story" subtitle="James Comey's Conspicuous Independence" />}
        >
        <img height="400px" src="https://westernqueensland.files.wordpress.com/2014/05/new-york-sattelite-1.jpg" />
        </CardMedia>

      </Card>
      </div>
      <div className="col-md-4 about">
       <Card>
        <CardMedia>
        </CardMedia>
        <CardText>Entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories.</CardText>
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
  </div>
);

export default Home;
