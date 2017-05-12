import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'material-ui/slider';

/* ----- COMPONENT STYLES ----- */

const styles = {
  root: {
    display: 'flex',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
};

/* ----- COMPONENT ----- */

class ViewStorySlider extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div style={styles.root}>
          <Slider
            axis="y-reverse"
            defaultValue={this.props.currScene.position}
            id="scene-navigator"
            min={0}
            max={this.props.scenes.length - 1}
            step={1}
            onChange={this.props.getNewScene}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { fetchScene } from '../../reducers/displayState';

const mapStateToProps = store => ({
  currScene: store.displayState.currScene,
  scenes: store.displayState.scenes
});

const mapDispatchToProps = dispatch => ({
  getNewScene(event, value) {
    event.preventDefault();
    dispatch(fetchScene(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewStorySlider);



