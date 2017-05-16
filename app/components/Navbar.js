import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.renderLoginSignup = this.renderLoginSignup.bind(this);
    this.renderLogout = this.renderLogout.bind(this);
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">

          <Link to="/" className="brand-logo center">
            <img src="/images/logo.png" style={{height: '50px'}}/>
            &nbsp; entwine
          </Link>

          <ul className="left hide-on-med-and-down">
            <li>
              <Link to="/editor">Create Story</Link>
            </li>
            <li>
              <Link to="/stories">All Stories</Link>
            </li>
            <li>
              <Link to="/stories/featured">Featured Story</Link>
            </li>
          </ul>

          {this.props.currentUser ? this.renderLogout() : this.renderLoginSignup()}

        </div>
      </nav>
    );
  }

  renderLoginSignup() {
    return (
      <ul className="right hide-on-med-and-down">
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
    const name = this.props.currentUser.display_name || this.props.currentUser.username || 'OAuth User';
    return (
      <ul className="right hide-on-med-and-down">
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
