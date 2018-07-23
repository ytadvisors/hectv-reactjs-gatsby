import React, { Component } from 'react';
import './modules.scss';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video_started: false,
      url: ''
    };
    this.startVideo = this.startVideo.bind(this);
    this.getLiveVideo = this.getLiveVideo.bind(this);
    this.url = '';
  }

  componentWillReceiveProps(newProps) {
    //Navigation on the same route (with a different path)
    if (this.props.url !== newProps.url) {
      this.setState({ url: newProps.url });
      console.log('Changing URL');
    }
  }

  componentDidMount() {}

  startVideo() {
    this.setState({ video_started: true });
  }

  getLiveVideo() {}

  render() {
    const {
      video_style,
      container_style,
      thumbnail,
      url,
      playing,
      videoCallback,
      is_live_video
    } = this.props;
    const { video_started } = this.state;
    let video_preview = '';
    let show_thumbnail = !video_started && thumbnail;

    if (show_thumbnail) {
      video_preview = (
        <div
          className="full-width video-preview"
          onClick={this.startVideo}
          style={{ backgroundImage: `url('${thumbnail}')` }}
        />
      );
    } else {
      video_preview = !is_live_video ? (
        <div className="player-wrapper">
          <ReactPlayer
            key={url}
            controls
            url={url}
            className="react-player"
            height="100%"
            width="100%"
            style={video_style}
            playing={playing || thumbnail}
            onEnded={videoCallback}
            data-vimeo-responsive="1"
          />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: this.state.url }} />
      );
    }

    return (
      <section className={`video-player fluid `}>
        <div className="row" />
        <div className="video-container" style={container_style}>
          {video_preview}
        </div>
      </section>
    );
  }
}

VideoPlayer.propTypes = {
  url: PropTypes.string,
  thumbnail: PropTypes.string,
  video_style: PropTypes.object,
  container_style: PropTypes.object,
  videoCallback: PropTypes.func,
  playing: PropTypes.bool,
  is_live_video: PropTypes.bool
};
