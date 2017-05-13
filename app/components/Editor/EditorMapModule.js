import React, {Component} from 'react';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import secrets from '../../../secrets.json';
import ReactTimeout from 'react-timeout';

let googleMapsClient = require('@google/maps').createClient({key: secrets.googlemaps});

/* ----- COMPONENT ----- */

class EditorMapModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [],
      location: '',
      locationFormatted: '',
      mapboxStyle: '',
      mapboxZoom: '',
      mapboxPitch: 30,
      mapboxAnimationMethod: 'flyTo'
    };
  }

  componentDidMount() {
    console.log("mounting map!")
    this.setState({
      coords: this.props.locations[0].coords,
      mapboxStyle: this.props.locations[0].style,
      mapboxZoom: this.props.locations[0].zoom
    })

    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)
    }, 1500);
  }

  changeMapboxStyle(event) {
    event.preventDefault();
    this.setState({mapboxStyle: event.target.value})
    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)

      this.props.setLocation(this.props.position, [{
        name: this.props.locations[0].name,
        coords: [this.state.coords],
        style: this.state.mapboxZoom,
        zoom: this.state.mapboxZoom,
      }]);
    }, 200);
  }

  changeMapboxZoom(event) {
    event.preventDefault();
    this.setState({mapboxZoom: event.target.value})
    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)

      this.props.setLocation(this.props.position, [{
        name: this.props.locations[0].name,
        coords: [this.state.coords],
        style: this.state.mapboxZoom,
        zoom: this.state.mapboxZoom,
      }]);
    }, 200);
  }

  changeLocation(index, valueOnClick, event) {
    let value;
    if (valueOnClick) value = valueOnClick;
    else if (event.key === 'Enter') value = event.target.value;
    if (event.key === 'Enter' || valueOnClick) {
      event.preventDefault();
      event.stopPropagation();
      this.findCoordinates(value);
    }
  }

  findCoordinates(location) {
    googleMapsClient.geocode({
      address: location
    }, (err, response) => {
      if (!err) {
        let results = response.json.results[0],
            coords = results.geometry.location,
            zoom;

        // if location type includes country or administrative area, set the zoom levels appropriately
        if (results.types.includes('country')) zoom = 3;
        else if (results.types.includes('administrative_area_level_1')) zoom = 5;
        else if (results.types.includes('administrative_area_level_2')) zoom = 7;
        else if (results.types.includes('administrative_area_level_3')) zoom = 8;
        else zoom = 12;

        // google gives an object {lat: x, lng: y} -> reactmapboxgl takes it in the form of [lng, lat]
        this.setState({
          coords: [coords.lng, coords.lat],
          locationFormatted: results.formatted_address,
          mapboxZoom: zoom
        });

        this.props.setTimeout(() => {

          this.props.setLocation(this.props.position, [{
            name: this.state.location,
            coords: [coords.lng, coords.lat],
            style: this.state.mapboxStyle,
            zoom: zoom,
          }]);

          console.log("saving map!")
          this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)
        }, 7000);
      }
    });
  }

  render() {
    return (
      <div className="editor-map">
  			<div className="map-editor-header">
					<div className="map-style">
						<label> Map Style: &nbsp; </label>
						<select
							value={this.state.mapboxStyle}
							onChange={this.changeMapboxStyle.bind(this)}
						>
							<option value="basic">Basic</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="outdoors">Outdoors</option>
							<option value="satellite">Satellite</option>
						</select>
					</div>

          <div>
						<label> Location: &nbsp; </label>
						 <input
              type="text"
              className="location-name-field"
              value={this.props.locations[0].name}
              onChange={this.props.onFieldChange.bind(this, 0, 'name')}
              onKeyPress={this.changeLocation.bind(this, 0, null)}
            />
					</div>

					<div className="map-zoom">
						<label> Map Zoom: &nbsp; </label>
						<select
							value={this.state.mapboxZoom}
							onChange={this.changeMapboxZoom.bind(this)}
						>
							<option value="1">1</option>  <option value="2">2</option>  <option value="3">3</option>  <option value="4">4</option>  <option value="5">5</option><option value="6">6</option>  <option value="7">7</option><option value="8">8</option>  <option value="9">9</option>  <option value="10">10</option>  <option value="11">11</option>  <option value="12">12</option>  <option value="13">13</option>  <option value="14">14</option>  <option value="15">15</option><option value="16">16</option>  <option value="17">17</option>  <option value="18">18</option>  <option value="19">19</option>  <option value="20">20</option>
						</select>
					</div>

          <button
            className="btn btn-default"
            onClick={this.props.onDeleteLocation.bind(this)}
          >
            <span className="glyphicon glyphicon-trash" ></span>
          </button>

        </div>
        {
          this.state.mapboxStyle ?
            <div className="generated-map">
              <ReactMapboxGl
                style={`mapbox://styles/mapbox/${this.state.mapboxStyle}-v9`} accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w" zoom={[this.state.mapboxZoom]}
                pitch={this.state.mapboxPitch}
                center={this.state.coords}
                movingMethod={this.state.mapboxAnimationMethod} // animation style; default 'flyTo'
                interactive="true" // if false, map cannot be manipulated
                containerStyle={{
                position: 'relative',
                height: '50vh',
                width: 'auto',
                display: 'flex'
              }}>
                <div>
                  {/* Need to set position of inner canvas to relative */}
                  <Layer
                    type="symbol"
                    id="marker"
                    layout={{
                    "icon-image": 'marker-15'
                  }}>
                    <Feature coordinates={this.state.coords}/>
                  </Layer>
                  <Marker coordinates={this.state.coords} anchor="bottom"/>
                </div>
              </ReactMapboxGl>
            </div> : null
          }
      </div>
    );
  }
}

/* ----- CONTAINER ----- */
import { connect } from 'react-redux';
import { setMap, changeLocation, deleteLocation, deleteMap, setLocation } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  maps: state.editor.scenes[ownProps.position].maps
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveMap(position, style, coords, zoom) {
    let coordsStr = coords.join(', ');
    dispatch(setMap(position, coordsStr, style, zoom));
  },
  onFieldChange(locationIndex, field, event) {
    this.setState({location: event.target.value})
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeLocation(ownProps.position, locationIndex, field, event.target.value));
  },
  setLocation(position, locationArr) {
    dispatch(setLocation(position, locationArr));
  },
  onDeleteLocation(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteLocation(ownProps.position));
    dispatch(deleteMap(ownProps.position));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReactTimeout(EditorMapModule));
