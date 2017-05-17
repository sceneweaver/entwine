import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import StoriesItems from './StoriesItems';

/* -----------------    COMPONENT     ------------------ */

class StoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      name: ''
    };

    this.filterStory = this.filterStory.bind(this);
    this.renderStorySearch = this.renderStorySearch.bind(this);
    this.renderNewStoryWidget = this.renderNewStoryWidget.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className="container">
        <ul className="list-group">
        <h3> <b> All stories </b> </h3>

        { this.renderStorySearch() }
        {
          this.props.stories
          .filter(this.filterStory)
          .map(story => <StoriesItems story={story} key={story.id} />)
        }
        {
          this.props.stories.length > 0 ? null :
            <li className="list-group-item story-item">
              <ul className="list-inline">
                <li>No stories yet! <Link to={'/editor'}> Be the first to write a story. </Link> </li>
              </ul>
            </li>
        }
        </ul>

      { currentUser ? <h3><b> Create a new story </b></h3> : null}
      { currentUser ? this.renderNewStoryWidget() : null }
      <br />

      </div>
    );
  }

  renderStorySearch() {
    return (
      <div className="list-group-item story-item search-box">
        <ul className="list-inline">
          <li>
            <input
              type="text"
              placeholder="Search by title"
              className="form-like"
              onChange={evt => this.setState({ title: evt.target.value })}
            />
          </li>
          <li>
            <span style={{color: 'white', fontSize: 15}}>by</span>
          </li>
          <li>
            <input
              className="form-like"
              type="text"
              placeholder="Search by author"
              onChange={evt => this.setState({ name: evt.target.value })}
            />
          </li>
        </ul>
        <i style={{color: 'white'}} className="fa fa-search" aria-hidden="true"></i>
      </div>
    );
  }

  renderNewStoryWidget() {
    const { currentUser } = this.props;
    return (
      <form onSubmit={this.onSubmit} className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <input
              name="title"
              type="text"
              className="form-like"
              placeholder="Story Title"
            />
          </li>
          <li>
            <span>by</span>
          </li>
          <li>
            {
              currentUser.isAdmin ?
              <select name="author_id" defaultValue="" required>
                <option value="" disabled>(select an author)</option>
                {
                  this.props.users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))
                }
              </select>
              : <Link to={`/users/${currentUser.id}`}>{currentUser.username || currentUser.email}</Link>
            }
          </li>
        </ul>
        <button
          type="submit"
          className="btn btn-warning btn-xs pull-right">
          <i className="fa fa-plus" aria-hidden="true"></i>
        </button>
      </form>
    );
  }

  filterStory(story) {
    // this is necessary as a user can be deleted and his stories are orphaned
    const author_name = (story && story.user) ? story.user.username : '';
    const titleMatch = new RegExp(this.state.title, 'i');
    const nameMatch = new RegExp(this.state.name, 'i');

    return titleMatch.test(story.title)
        && nameMatch.test(author_name);
  }

  onSubmit() {
    browserHistory.push('/editor')
  }
}

/* -----------------    CONTAINER     ------------------ */

import { browserHistory } from 'react-router'

const mapState = ({ users, stories, auth }) => ({ users, stories, currentUser: auth });

const mapDispatch = {};

export default connect(mapState, mapDispatch)(StoryList);
