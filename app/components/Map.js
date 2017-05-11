
import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({
  key: secrets.googlemaps
});

// googleMapsClient.geocode({ // this is for testing and demo purposes - shows how the geocode method works
//   address: 'Los Angeles'
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results[0]);
//     console.log(response.json.results[0].geometry.location);
//   }
// });

/* ----- COMPONENT ----- */

class Test extends Component {
  constructor() {
    super()
    this.state = {
      coords: [],
      locationTypes: [],
      locationAddress: '',
      mapboxStyle: 'light',
      mapboxZoom: 13,
      mapboxPitch: 30,
      mapboxInteractivity: true,
      mapboxAnimationMethod: 'flyTo',
    }
    this.onFindCoordsClick = this.onFindCoordsClick.bind(this);
    this.findCoordinates = this.findCoordinates.bind(this);
    this.changeMapboxStyle = this.changeMapboxStyle.bind(this);
    this.changeMapboxZoom = this.changeMapboxZoom.bind(this);
    this.changeMapboxAnimationMethod = this.changeMapboxAnimationMethod.bind(this);
    this.toggleMapboxInteractivity = this.toggleMapboxInteractivity.bind(this);
  }

  findCoordinates(location) {
    googleMapsClient.geocode({
      address: location
    }, (err, response) => {
      if (!err) {
        let results = response.json.results[0]
          , coords = results.geometry.location
          , style, zoom;

        // if location type includes park or natural_feature, use 'outdoors' map
        // https://developers.google.com/places/supported_types
        if (results.types.includes('natural_feature') || results.types.includes('park')) {
          style = 'outdoors';
          zoom = 5;
        } else {
          style = 'light';
        }

        // if location type includes
        if (results.types.includes('country')) zoom = 3;
        else if (results.types.includes('administrative_area_level_1')) zoom = 5;
        else if (results.types.includes('administrative_area_level_2')) zoom = 7;
        else if (results.types.includes('administrative_area_level_3')) zoom = 8;
        else zoom = 13;

        // google gives an object {lat: x, lng: y} -> reactmapboxgl takes it in the form of [lng, lat]
        this.setState({
          coords: [coords.lng, coords.lat],
          locationAddress: results.formatted_address,
          locationTypes: results.types,
          mapboxStyle: style,
          mapboxZoom: zoom,
        });
      }
    });
  }

  onFindCoordsClick(event) {
    event.preventDefault();
    this.findCoordinates(event.target.location.value);
  }

  changeMapboxStyle(event) {
    event.preventDefault();
    this.setState({ mapboxStyle: event.target.value })
  }

  changeMapboxZoom(event) {
    event.preventDefault();
    this.setState({ mapboxZoom: event.target.value })
  }

  changeMapboxAnimationMethod(event) {
    event.preventDefault();
    this.setState({ mapboxAnimationMethod: event.target.value })
  }

  toggleMapboxInteractivity(event) {
    event.preventDefault();
    this.setState({ mapboxInteractivity: event.target.value })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
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
            <h5> <b> Coordinates: </b> {this.state.locationTypes.length > 0 ? this.state.coords.join(', ') : 'Search for a location first!'} </h5>
            <h5> <b> Formatted Address: </b> {this.state.locationTypes.length > 0 ? this.state.locationAddress : 'Search for a location first!'} </h5>
            <h5> <b> Location Tags: </b> {this.state.locationTypes.length > 0 ? this.state.locationTypes.join(', ') : 'Search for a location first!'} </h5>

            <b> Map Style: &nbsp; </b>
            <select value={this.state.mapboxStyle} onChange={this.changeMapboxStyle}>
              <option value="basic">Basic</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="outdoors">Outdoors</option>
              <option value="satellite">Satellite</option>
            </select>

            <b> &nbsp; Animation Type: &nbsp; </b>
            <select value={this.state.mapboxAnimationMethod} onChange={this.changeMapboxAnimationMethod}>
              <option value="flyTo">Fly To</option>
              <option value="jumpTo">Jump To</option>
              <option value="easeTo">Ease To</option>
            </select>

            <b> Map Zoom: &nbsp; </b>
            <select value={this.state.mapboxZoom} onChange={this.changeMapboxZoom}>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="9">9</option>
              <option value="11">11</option>
              <option value="13">13</option>
              <option value="15">15</option>
              <option value="17">17</option>
              <option value="19">19</option>
            </select>

            <b> &nbsp; Lock Map? &nbsp; </b>
            <select value={this.state.mapboxInteractivity} onChange={this.toggleMapboxInteractivity}>
              <option value="true">No</option>
              <option value="false">Yes</option>
            </select>

          </div>
          <div className="col-md-8">
            {
              this.state.locationTypes.length > 0 ?
                <ReactMapboxGl
                  style={`mapbox://styles/mapbox/${this.state.mapboxStyle}-v9`}
                  accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
                  zoom={[this.state.mapboxZoom]}
                  pitch={this.state.mapboxPitch}
                  center={this.state.coords}
                  movingMethod={this.state.mapboxAnimationMethod} // animation style; default 'flyTo'
                  interactive={this.state.mapboxInteractivity} // if false, map cannot be manipulated
                  containerStyle={{
                    height: "500px",
                    width: "auto"
                  }}>
                  <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={this.state.coords} />
                  </Layer>
                  {this.state.locationTypes.length > 0 ?
                    <Marker
                      coordinates={this.state.coords}
                      anchor="bottom">
                    </Marker> : null
                  }
                </ReactMapboxGl> : <div style={{ backgroundColor: 'lightgrey', height: 500, width: 'auto', justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: 20 }}> <span>Waiting for location input...</span> </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

export default connect()(Test);
