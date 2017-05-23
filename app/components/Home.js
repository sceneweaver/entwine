import React, { Component } from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Tutorial from './Tutorial';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTutorialOpen: false
    };
  }

  // method currently not being used, but will allow for on-page toggling of tutorial carousel in future releases
  onTutorialClick() {
    this.setState({isTutorialOpen: !this.state.isTutorialOpen})
  }

  render() {
    return (
      <div className="home home-margin">
        <div className="row flex">

        {this.state.isTutorialOpen ? <Tutorial /> : null}

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

          <div className="lead-row flex-card flex-col" style={{backgroundColor: '#2d2d86', color: 'white'}}>
            <h2> what is entwine? </h2>
            <h3> entwine is a smart publishing platform enabling anyone to create a beautiful, interactive story. </h3>
            <div className="create-story">
              <div className="create-story-btn hoverable" onClick={this.onTutorialClick.bind(this)}> Tutorial: Create Your Own Story! </div>
            </div>
          </div>

        </div>

      <div className="row flex">
        <Link to="stories/1">
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

      <Link to="stories/2">
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
  }
}

export default Home;
