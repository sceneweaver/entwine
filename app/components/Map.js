
import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import secrets from '../../secrets.json'

console.log(secrets.googlemaps)

let googleMapsClient = require('@google/maps').createClient({
  key: `${secrets.googlemaps}`
});

googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});

/* ----- COMPONENT ----- */

class Test extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <ReactMapboxGl
          style="mapbox://styles/mapbox/outdoors-v9"
          accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
          containerStyle={{
            height: "500px",
            width: "500px"
          }}>
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "marker-15" }}>
              <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
            </Layer>
        </ReactMapboxGl>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

export default connect()(Test);
