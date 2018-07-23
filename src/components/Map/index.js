import React, { Component } from 'react';
import './modules.scss';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const MapWithAMarker = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 38.745697, lng: -90.437065 }}
    >
      <Marker position={{ lat: 38.745697, lng: -90.437065 }}>
        <InfoWindow>
          <div>
            <p>
              <b>3221 McKelvey RD</b>
            </p>
            <p>3221 McKelvey Rd, Bridgeton, Mo</p>
            <p>63044</p>
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  ))
);

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { mapKey } = this.props;
    let mapUrl = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&v=3.exp&libraries=geometry,drawing,places`;
    return (
      <section>
        <div className="row">
          <div className="contact-container">
            <div className="col-md-12 contact-field">
              <div className="interactive-map">
                <MapWithAMarker
                  googleMapURL={mapUrl}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `500px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
