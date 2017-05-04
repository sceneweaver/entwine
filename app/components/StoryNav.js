import React, { Component } from 'react';
import ReactSlider from 'react-slider';

export default class StoryNav extends Component {
  render() {
    return (
      <div>
        <ReactSlider
          defaultValue={[0, 100]}
          orientation="vertical"
        />
      </div>
    );
  }
}
