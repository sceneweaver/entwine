import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { removeStory } from '../../redux/stories';


/* -----------------    COMPONENT     ------------------ */

class StoryItem extends React.Component {
  render() {
    const { story, removeStory, currentUser } = this.props;
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === story.author_id);
    return (
      <li className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <Link className="" to={`/stories/${story.id}`}>{story.title}</Link>
          </li>
          <li>
            <span>by</span>
          </li>
          <li>
            <Link to={`/users/${story.author_id}`}>{story.author.name || story.author.email}</Link>
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

const mapState = ({ currentUser }) => ({ currentUser });
// // equivalent to:
// const mapState = (state) => {
//   return {
//     currentUser: state.currentUser
//   };
// };

const mapDispatch = { removeStory };

export default connect(mapState, mapDispatch)(StoryItem);
