import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui';

/* ----- COMPONENT ----- */
class ViewStoryStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
    };
  }

  handleNext() {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  }

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  }

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const {stepIndex} = this.state;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
          <Stepper
            activeStep={stepIndex}
            linear={false}
            orientation="vertical"
          >
            {
              this.props.scenes.length > 1 ? (
                this.props.scenes.map((scene, index) => (
                  <Step key={`${index}: ${scene.title}`}>
                    <StepButton
                      onTouchTap={() => this.setState({stepIndex: index})}
                      onClick={this.props.getNewScene.bind(this, index)}
                    >
                      {scene.title}
                    </StepButton>
                  </Step>
                ))
              ) : (
                null
              )
            }
          </Stepper>
        </div>
      </MuiThemeProvider>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { fetchScene } from '../../reducers/displayState';

const mapStateToProps = store => ({
  currScene: store.displayState.currScene,
  scenes: store.displayState.scenes
});

const mapDispatchToProps = dispatch => ({
  getNewScene(value, event) {
    console.log(value);
    event.preventDefault();
    dispatch(fetchScene(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewStoryStepper);
