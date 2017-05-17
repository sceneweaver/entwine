import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const Home = () => (
  <div className="home home-margin">
    <div className="row flex">

      <Link to="stories/3">
        <div className="lead-row lead-width featured-card hoverable" style={{backgroundImage: `url(https://www.wired.com/wp-content/uploads/2017/05/donut_opener.jpg)`}}>
          <div>
            <h1>
              <b>Featured Story:</b> Apple's New Campus: An Exclusive Look Inside the Mothership
            </h1>
            <h2>
              Steven Levy
            </h2>
          </div>
        </div>
      </Link>

      <div className="lead-row flex-card flex-col hoverable" style={{backgroundColor: '#2d2d86', color: 'white'}}>
        <h2> what is entwine? </h2>
        <h3> entwine allows content creators to quickly embed interactive maps, information about key characters, and multiple scenes into their stories. </h3>
        <div>
          <Link to="/editor">
            <div className="create-story-button"> Create a New Story </div>
          </Link>
        </div>
      </div>

    </div>

    <div className="row flex">
      <Link to="stories/2">
         <div className="second-row flex-card hoverable" style={{backgroundColor: '#732626'}}>
            <div>
              <h1>
                <b>Featured Story:</b> North Korea's Apocalyptic Propagandists
              </h1>
              <h2>
                Hannah Beech
              </h2>
            </div>
         </div>
      </Link>
{/*
      <div style={{backgroundColor: 'transparent', flex: 1}}>
      </div>*/}

      <Link to="stories/1">
        <div className="second-row second-width featured-card hoverable" style={{backgroundImage: `url(https://www.rented.com/content/images/2016/02/photo-1415201364774-f6f0bb35f28f.jpg)`}}>
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
