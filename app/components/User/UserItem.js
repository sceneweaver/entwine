import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { removeUser } from '../../redux/users';
import { removeStory } from '../../redux/stories';

/* -----------------    COMPONENT     ------------------ */

class UserItem extends React.Component {

  constructor (props) {
    super(props);
    this.removeUserCallback = this.removeUserCallback.bind(this);
  }

  render () {
    const { user, currentUser } = this.props;
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === user.id);
    return (
      <div className="list-group-item min-content user-item">
        <div className="media">
          <div className="media-left media-middle icon-container">
            <img className="media-object img-circle" src={user.photo} />
          </div>
          <Link
            className="media-body"
            activeClassName="active"
            to={`/users/${user.id}`}>
            <h4 className="media-heading tucked">
              <span placeholder="Jean Doe">{user.name}</span>
            </h4>
            <h5 className="tucked">
              <span>{user.email}</span>
            </h5>
            <h5 className="tucked">
              <span>{user.phone}</span>
            </h5>
          </Link>
          <div className="media-right media-middle">
            {
              authorized ?
              <button
                  className="btn btn-default"
                  onClick={this.removeUserCallback}>
                <span className="glyphicon glyphicon-remove" />
              </button>
              : null
            }
          </div>
        </div>
      </div>
    );
  }

  removeUserCallback (event) {
    const { removeUser, removeStory, user, stories } = this.props;
    event.stopPropagation();
    removeUser(user.id);
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({ stories, currentUser }) => ({ stories, currentUser });

const mapDispatch = { removeUser, removeStory };

export default connect(mapState, mapDispatch)(UserItem);
