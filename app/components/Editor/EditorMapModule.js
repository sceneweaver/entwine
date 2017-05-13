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
      coords: [-74.009160, 40.705076],
      locationTypes: [],
      locationAddress: '',
      mapboxStyle: 'light',
      mapboxZoom: 12,
      mapboxPitch: 30,
      mapboxAnimationMethod: 'flyTo'
    };
    this.changeMapboxStyle = this.changeMapboxStyle.bind(this);
    this.changeMapboxZoom = this.changeMapboxZoom.bind(this);
  }

  componentDidMount() {
    console.log("mounting map!", this.props.locations[0])
    this.props.setTimeout(() => {
      this.setState({
        coords: this.props.locations[0].coords,
        mapboxStyle: this.props.locations[0].style,
        mapboxZoom: this.props.locations[0].zoom
      })
    }, 1000);

    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)
    }, 1500);
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {
    console.log('receiving props!', nextProps)
  }

  changeMapboxStyle(event) {
    event.preventDefault();
    this.setState({mapboxStyle: event.target.value})
    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)
    }, 200);
  }

  changeMapboxZoom(event) {
    event.preventDefault();
    this.setState({mapboxZoom: event.target.value})
    this.props.setTimeout(() => {
      console.log("saving map!")
      this.props.onSaveMap.call(this, this.props.position, this.state.mapboxStyle, this.state.coords, this.state.mapboxZoom)
    }, 1500);
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
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
							<option value="13">13</option>
							<option value="14">14</option>
							<option value="15">15</option>
							<option value="16">16</option>
							<option value="17">17</option>
							<option value="18">18</option>
							<option value="19">19</option>
							<option value="20">20</option>
						</select>
					</div>
        </div>

        <div className="generated-map">
          <ReactMapboxGl
            style={`mapbox://styles/mapbox/${this.state.mapboxStyle}-v9`} accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w" zoom={[this.state.mapboxZoom]}
            pitch={this.state.mapboxPitch}
            center={this.props.locations[0].coords}
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
                <Feature coordinates={this.props.locations[0].coords}/>
              </Layer>
              <Marker coordinates={this.props.locations[0].coords} anchor="bottom"/>
            </div>
          </ReactMapboxGl>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReactTimeout(EditorMapModule));
