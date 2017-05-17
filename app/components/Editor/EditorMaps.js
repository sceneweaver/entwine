import React, { Component } from 'react';
import EditorMapModule from './EditorMapModule';

/* ----- COMPONENT ----- */

class EditorMaps extends Component {
  constructor(){
    super();
    this.state = {
      disableAdd: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // if there are no locations, let the user add map
    if (!nextProps.locations[0]) this.setState({disableAdd: false});
  }

  render() {
    return (
      <div className="maps-module">
        <div className="flexcontainer-module-header maps-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideMaps}
              className="btn maps-module-btn"
            >
              Close
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + " "} >> Map</h3>

          <div className="flex-self-right">
            <button
              onClick={this.props.onAddMap.bind(this)}
              className="btn maps-module-btn"
              disabled={this.state.disableAdd}
            >
              Add Map &nbsp; <span className="glyphicon glyphicon-plus" />
            </button>
          </div>
        </div>
          {
            this.props.locations.length ?
              <EditorMapModule
                position={this.props.position}
              />
              : (<div className="locations-box">
              <h3>Each scene can either have a header image or a map.</h3>
              <p>Click Add Map above to generate a map from the locations in your story.</p>
            </div>)
          }
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { generateMapLocations, deselectModule } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  sceneTitle: state.editor.scenes[ownProps.position].title,
  paragraphs: state.editor.scenes[ownProps.position].paragraphs
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHideMaps(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).removeClass('toggled');
    $('.editorscene-sidebar-bg').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
  },
  onAddMap(event) {
    this.setState({disableAdd: true});
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateMapLocations(ownProps.position));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);
