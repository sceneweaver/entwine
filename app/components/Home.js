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
              <b>Featured Story:</b> Apple's New Campus: A Look Inside the Mothership
            </h1>
            <h2>
              Steven Levy
            </h2>
          </div>
        </div>
      </Link>

      <div className="lead-row flex-card flex-col hoverable" style={{backgroundColor: '#2d2d86', color: 'white'}}>
        <h2> what is entwine? </h2>
        <h3> entwine allows users to create stories with interactive maps, information about key characters, and multiple scenes. </h3>
        <div className="create-story">
          <Link to="/editor">
            <div className="create-story-btn"> Create a New Story </div>
          </Link>
        </div>
      </div>

    </div>

    <div className="row flex">
      <Link to="stories/2">
         <div className="second-row flex-card hoverable" style={{background: 'linear-gradient(141deg, #602020 15%, #993333 51%, #cc6666 82%)'}}>
            <div>
              <h1>
                <b>Featured Story:</b> North Korea's Consistently Apocalyptic Propagandists
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
