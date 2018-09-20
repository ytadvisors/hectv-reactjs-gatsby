import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from '../VideoPlayer/index';
import './styles.scss';

export default class Content extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post: { content, video_url }, container_style } = this.props;
    return (
      <section className="content">
        {video_url && (
          <VideoPlayer url={video_url} container_style={container_style} />
        )}
        <span dangerouslySetInnerHTML={{ __html: content }} />
      </section>
    );
  }
}
