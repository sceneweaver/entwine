import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import UserItem from './UserItem';
import StoryItem from '../Story/StoryItem';
import { addStory } from '../../redux/stories';

/* -----------------    COMPONENT     ------------------ */

class UserDetail extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { user, stories, currentUser } = this.props;
    if (!user) return <div />  // the user id is invalid or data isn't loaded yet
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === user.id);
    return (
      <div className="container">
        <UserItem user={user} />
        <div className="panel panel-warning">
          <div className="panel-heading">
            <h2 className="panel-title large-font">stories</h2>
          </div>
          <ul className="list-group">
            {
              authorized ?
              <form className="list-group-item story-item" onSubmit={this.onSubmit}>
                <input
                  name="title"
                  type="text"
                  className="form-like"
                  required
                  placeholder="Story Title"
                />
                <button type="submit" className="btn btn-warning btn-xs">
                  <span className="glyphicon glyphicon-plus" />
                </button>
              </form>
              : null
            }
            {
              stories
              .filter(story => story.author_id === user.id)
              .map(story => <StoryItem story={story} key={story.id} />)
            }
          </ul>
        </div>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();
    const { addStory, user } = this.props;
    const story = {
      title: event.target.title.value,
      author_id: user.id
    };
    addStory(story);
    event.target.title.value = '';
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({ users, stories, currentUser }, ownProps) => {
  const param_id = Number(ownProps.params.id);
  return {
    user: _.find(users, user => user.id === param_id),
    stories,
    currentUser
  };
};

const mapDispatch = { addStory };

export default connect(mapState, mapDispatch)(UserDetail);
