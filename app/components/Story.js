import React, { Component } from 'react'

import StoryNav from './StoryNav.js'
import Scene from './Scene.js'

export default class Story extends Component {
  render() {
    console.log("this.props", this.props)
    return (
      <div>
        <StoryNav />
        <Scene dummyScene={this.props.dummyScene} />
      </div>
    )
  }
}
