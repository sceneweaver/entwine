import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import secrets from '../../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({
  key: secrets.googlemaps
});

/* ----- COMPONENT ----- */

class EditorMapModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [],
      locationTypes: [],
      locationAddress: '',
      mapboxStyle: 'light',
      mapboxZoom: 13,
      mapboxPitch: 30,
      mapboxInteractivity: true,
      mapboxAnimationMethod: 'flyTo',
    };
    this.onFindCoordsClick = this.onFindCoordsClick.bind(this);
    this.findCoordinates = this.findCoordinates.bind(this);
    this.changeMapboxStyle = this.changeMapboxStyle.bind(this);
    this.changeMapboxZoom = this.changeMapboxZoom.bind(this);
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

  render() {
    return (
      <div className="editor-map">

  			<div className="map-editor-header">

					<div className="map-style">
						<label> Map Style: &nbsp; </label>
						<select
							value={this.state.mapboxStyle}
							onChange={this.changeMapboxStyle}
						>
							<option value="basic">Basic</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="outdoors">Outdoors</option>
							<option value="satellite">Satellite</option>
						</select>
					</div>

					<div className="map-zoom">
						<label> Map Zoom: &nbsp; </label>
						<select
							value={this.state.mapboxZoom}
							onChange={this.changeMapboxZoom}
						>
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
					</div>

          <button onClick={this.props.onSaveMap.bind(this, this.props.position, this.state.mapboxStyle, this.props.locations[0].coords, this.state.mapboxZoom)}>Save Map</button>

        </div>

        <div className="generated-map">
        {
          this.props.locations[0] ?
          (<div>
          	<ReactMapboxGl
							style={`mapbox://styles/mapbox/${this.state.mapboxStyle}-v9`}
							accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
							zoom={[this.state.mapboxZoom]}
							pitch={this.state.mapboxPitch}
							center={this.props.locations[0].coords}
							movingMethod={this.state.mapboxAnimationMethod} // animation style; default 'flyTo'
							interactive="true" // if false, map cannot be manipulated
							containerStyle={{
								position: 'relative',
								height: "500px",
								width: "auto"
            	}}
						>
              <div> {/* Need to set position of inner canvas to relative */}
                <Layer
                  type="symbol"
                  id="marker"
                  layout={{ "icon-image": "marker-15" }}
								>
                	<Feature coordinates={this.props.locations[0].coords} />
                </Layer>
                <Marker
                  coordinates={this.props.locations[0].coords}
                  anchor="bottom"
								/>
              </div>
            </ReactMapboxGl>
          </div>)
          : null
        }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */
import { connect } from 'react-redux';
import { setMap } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  maps: state.editor.scenes[ownProps.position].maps
});

const mapDispatchToProps = (dispatch) => ({
  onSaveMap(position, style, coords, zoom) {
    let coordsStr = coords.join(', ');
    dispatch(setMap(position, coordsStr, style, zoom));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMapModule);
