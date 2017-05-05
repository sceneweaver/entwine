import React from 'react';
import { browserHistory } from 'react-router'

/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }

  render() {
    const { message } = this.props;
    return (
      <div className="signin-container">
        <div className="buffer local">
          <form onSubmit={this.onSignupSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Name (optional)</label>
              <input
                name="display_name"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">{message}</button>
          </form>
        </div>
        <div className="or buffer">
          <div className="back-line">
            <span>OR</span>
          </div>
        </div>
        <div className="buffer oauth">
          <p>
            <a
              target="_self"
              href="/api/auth/google"
              className="btn btn-social btn-google">
              <i className="fa fa-google" />
              <span>{message} with Google</span>
            </a>
          </p>
          <p>
            <a
              target="_self"
              href="/api/auth/github"
              className="btn btn-social btn-github">
              <i className="fa fa-github" />
              <span>{message} with GitHub</span>
            </a>
          </p>
          <p>
            <a
              target="_self"
              href="/api/auth/twitter"
              className="btn btn-social btn-twitter">
              <i className="fa fa-twitter" />
              <span>{message} with Twitter</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  onSignupSubmit(event) {
    event.preventDefault();
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value,
      email: event.target.email.value,
      display_name: event.target.display_name.value,
    };
    this.props.signup(credentials);
    browserHistory.push('/');
  }
}

/* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux';
import { signupAndGoToUser } from '../reducers/auth';

const mapState = () => ({ message: 'Sign up' });

const mapDispatch = { signup: signupAndGoToUser };

export default connect(mapState, mapDispatch)(Signup);
