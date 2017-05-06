
import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import secrets from '../../secrets.json'

let googleMapsClient = require('@google/maps').createClient({
  key: secrets.googlemaps
});

googleMapsClient.geocode({ // this is for testing purposes - shows how the geocode method works
  address: 'Los Angeles'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results[0]);
    console.log(response.json.results[0].geometry.location);
  }
});

/* ----- COMPONENT ----- */

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      coords: ''
    }
    this.onFindCoordsClick = this.onFindCoordsClick.bind(this);
    // this.findCoordinates = this.findCoordinates.bind(this);
  }

  findCoordinates(location) {
    console.log('got in here, this is the location', location);
    googleMapsClient.geocode({
      address: location
    }, function(err, response) {
      if (!err) {
        let coords = response.json.results[0].geometry.location;
        // mapbox and google maps lat lng seem to be flipped
        this.setState({coords: "why isn't this working?"});
        console.log('these are the response and coords', response, coords, coords.lat)
        console.log("hi", this.state.coords)
      }
    });
  }

  onFindCoordsClick(event){
    event.preventDefault();
    console.log(event.target.location.value)
    this.findCoordinates(event.target.location.value);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h2> Map Creator </h2>
            <form onSubmit={this.onFindCoordsClick}>
              <div className="form-group">
                <label>Put in a location!</label>
                <input
                  name="location"
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-block btn-primary">Find Location</button>
            </form>
             <h4> <b> Coords for our map: </b> {this.state.coords ? this.state.coords : 'Search for a coordinate first'} </h4>
          </div>
          <div className="col-md-9">
           <ReactMapboxGl
              style="mapbox://styles/mapbox/dark-v9"
              accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
              zoom={[13]}
              pitch={30}
              center={[-118.2436849, 34.0522342]}
              containerStyle={{
                height: "500px",
                width: "auto"
              }}>
                <Layer
                  type="symbol"
                  id="marker"
                  layout={{ "icon-image": "marker-15" }}>
                  <Feature coordinates={[-118.2436849, 34.0522342]}/>
                </Layer>
                <Marker
                  coordinates={[-118.2436849, 34.0522342]}
                  anchor="bottom">
                </Marker>
            </ReactMapboxGl>
          </div>
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

export default connect()(Test);
