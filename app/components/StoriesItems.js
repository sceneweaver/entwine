import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { removeStory } from '../reducers/stories';

/* -----------------    COMPONENT     ------------------ */

class StoryItem extends React.Component {
  render() {
    const { story, currentUser } = this.props;
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === story.author_id);
    return (
      <li className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <Link className="" to={`/stories/${story.id}`}>{story.title}</Link>
          </li>
          <li>
            <span>by {story.user ? story.user.username : 'anonymous'}</span>
          </li>
          <li>
            {/*<Link to={`/users/${story.author_id}`}>{story.author.username}</Link>*/}
          </li>
        </ul>
        {
          authorized ?
          <button
            className="btn btn-default btn-xs"
            onClick={ () => removeStory(story.id) }>
            <span className="glyphicon glyphicon-remove" />
          </button>
          : null
        }
      </li>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapState = ({ auth }) => ({ currentUser: auth });

const mapDispatch = { removeStory };

export default connect(mapState, mapDispatch)(StoryItem);
