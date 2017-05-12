import React from 'react';

const Home = () => (
  <div className="home">
    <div className="banner text-inverted inverted flex-container">
        <h1>entwine: &nbsp; <br/>
        create and tell interactive stories on the web </h1>
    </div>
    <div className="about">
        <div className="container">
          <div className="media large-font">
            {/*<div className="media-left media-middle">
              <img className="media-object" src="/images/stock-footage-old-typewriter.jpg" />
            </div>*/}
            <div className="media-body">
              <p className="media-heading large-font home-page-header"><b>enhancing the storytelling experience</b></p>
              <span className="home-page-text">Check out our featured stories! Entwine allows content creators to quickly embed interactive maps, information about key characters, and data visualizations into their stories. </span>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="media large-font home-page-header">
            <div className="media-body">
              <p className="media-heading large-font"><b>scene-by-scene navigation</b></p>
              <span className="home-page-text">The stories created on Entwine are told across scenes. This allows the reader to transition through different key experiences chosen by the author. </span>
            </div>
            {/*<div className="media-right media-middle">
              <img className="media-object" src="/images/stock-footage-old-man.jpg" />
            </div>*/}
          </div>
        </div>
      </div>
  </div>
);

export default Home;
