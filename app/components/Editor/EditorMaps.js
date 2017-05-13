import React, { Component } from 'react';
import EditorMapModule from './EditorMapModule';
import EditorMapsLocation from './EditorMapsLocation';

/* ----- COMPONENT ----- */

class EditorMaps extends Component {
  constructor(){
    super();
    this.state = {
      disableAdd: false
    }
  }

  render() {
    return (
      <div className="maps-module">
        <div className="flexcontainer-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideMaps}
              className="btn maps-module-btn"
            >
              Collapse &nbsp; <span className="glyphicon glyphicon-menu-right"></span>
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + " "} >> Map</h3>

          <div className="flex-self-right">
            <button
              onClick={this.props.onAddMap}
              className="btn maps-module-btn"
              disabled={this.state.disableAdd}
            >
              Add Map &nbsp; <span className="glyphicon glyphicon-plus" />
            </button>
          </div>

        </div>

        <div className="locations-box">
        {
          this.props.locations.length ?
              <EditorMapsLocation
                location={this.props.locations[0]}
                index={0}
                position={this.props.position}
              />
            : <p>No map yet for this scene. Add a new map!</p>
        }
        </div>

        {
          this.props.locations.length ?
            <EditorMapModule
              position={this.props.position}
            />
            : null
        }
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { generateMapLocations, toggleMaps } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  sceneTitle: state.editor.scenes[ownProps.position].title,
  paragraphs: state.editor.scenes[ownProps.position].paragraphs
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHideMaps(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).toggleClass('toggled');
    dispatch(toggleMaps(ownProps.position, true));
  },
  onAddMap(event) {
    this.setState({disableAdd: true})
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateMapLocations(ownProps.position));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);
