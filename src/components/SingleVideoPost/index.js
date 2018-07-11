import React, { Component } from 'react';
import './styles.scss';
import VideoPlayer from './../VideoPlayer';
import PropTypes from 'prop-types';
import ShareSocialLinks from './../../components/ShareSocialLinks';

export default class SingleVideoPost extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const {
      post: { title, video_url, content },
      children,
      videoCallback,
      is_live_video,
      url
    } = this.props;
    let shareTitle = `Check out "${title}"`;

    const container_style = is_live_video
      ? {
          background: '#eee',
          padding: '20px',
          height: 'auto',
          minHeight: '360px'
        }
      : { padding: '0' };

    return (
      <section className="post-container">
        <section>
          <div className="col-md-12 no-padding title">
            <h3 dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </section>
        <VideoPlayer
          url={video_url}
          container_style={container_style}
          videoCallback={videoCallback}
          is_live_video={is_live_video}
        />
        <div className="row share-link-container">
          <div className="pull-left">{children}</div>
          <div className="pull-right">
            <div className="social-link-text">Share</div>
            <div className="social-links">
              <ShareSocialLinks url={url} title={shareTitle} body={content} />
            </div>
          </div>
        </div>
        <div className="row blog-content">
          <p>
            <span dangerouslySetInnerHTML={{ __html: content }} />
          </p>
        </div>
      </section>
    );
  }
}

SingleVideoPost.propTypes = {
  url: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  videoCallback: PropTypes.func.isRequired,
  is_live_video: PropTypes.bool
};
