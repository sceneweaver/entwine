import React, { Component } from 'react';

/* ----- COMPONENT ----- */

const ViewActors = props => {
  return (
      <div className="actorsBlock">
          { props.actors ? <h3 className="actors-heading article-font">Actors</h3> : null }
          { props.actors ?
            props.actors.map(actor => (
              <div key={actor.name}>
                      {actor.image ?
        <div className="img-circle" style={{ backgroundImage: `url(${actor.image})` }} />
        :
        <div className="img-circle-letter" style={{ backgroundColor: 'rgb(14, 186, 100)' }} >
            {actor.name[0]}
        </div>
      }
                <h5 className="article-font">{actor.name}</h5>
                <p>{actor.description}</p>
              </div>
            ))
            : null}
        </div>
  );
};


/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  actors: store.displayState.currScene.actors
});

export default connect(mapStateToProps)(ViewActors);
