import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './styles.scss';

export default class LiveVideo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { video: { url, title, start_date } } = this.props;
    return (
      <article className="live-video">
        {url && (
          <div className="video-details">
            <div className="container">
              <div className="live-tab">Live</div>
              <div className="live-details">
                <div>{title}</div>
                <div>{moment(start_date).fromNow()}</div>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }
}

LiveVideo.propTypes = {
  video: PropTypes.object.isRequired
};
