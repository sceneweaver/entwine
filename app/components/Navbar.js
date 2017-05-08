import React from 'react';
import { Link, browserHistory } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.renderLoginSignup = this.renderLoginSignup.bind(this);
    this.renderLogout = this.renderLogout.bind(this);
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target=".navbar-collapse">
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/"><img src="/images/logo.png" /></Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li>
                {/*<Link to="/users" activeClassName="active">users</Link>*/}
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/stories" activeClassName="active">All Stories</Link>
              </li>
              <li>
                <Link to="/editor">Create New Story</Link>
              </li>
              <li>
                <Link to="/maptest">Map Testing</Link>
              </li>
            </ul>
            { this.props.currentUser ? this.renderLogout() : this.renderLoginSignup() }
          </div>
        </div>
      </nav>
    );
  }

  renderLoginSignup() {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li>
         <Link to="/signup" activeClassName="active">Sign Up</Link>
        </li>
        <li>
          <Link to="/login" activeClassName="active">Log In</Link>
        </li>
      </ul>
    );
  }

  renderLogout() {
    const name = this.props.currentUser.display_name || this.props.currentUser.email || 'OAuth User';
    return (
      <ul className="nav navbar-nav navbar-right">
        <li>
        <button
          className="navbar-btn btn btn-default"
          onClick={this.props.logout}>
          Log Out {name}
        </button>
        </li>
      </ul>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux';
import { logout as logOutUser } from '../reducers/auth';

const mapState = ({ auth }) => ({ currentUser: auth });

const mapDispatch = dispatch => ({
  logout: () => {
    dispatch(logOutUser());
    // browserHistory.push('/'); // removed to demo logout instant re-render
  }
});

export default connect(mapState, mapDispatch)(Navbar);
