import React, { Component } from 'react';
import * as Material from 'react-icons/lib/md';

import './styles.scss';
import moment from 'moment';
import VideoPlayer from '../VideoPlayer/index';

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const container_style = { padding: '0' };
    const {
      post: { date, price, title, thumbnail, content, venue, video_url, link },
      classes
    } = this.props;
    return (
      <section className="post-container">
        <div className="col-md-12 no-padding">
          <h2 dangerouslySetInnerHTML={{ __html: title }} />
          <ul className="post-details">
            {venue && (
              <li>
                <Material.MdLocationOn size="25" color="#4ea2ea" />
                <span dangerouslySetInnerHTML={{ __html: venue }} />
              </li>
            )}
            {link && (
              <li>
                <span>
                  <a href={link} target="_blank">
                    {' '}
                    {link}{' '}
                  </a>
                </span>
              </li>
            )}
            {date && (
              <li>
                <span>{date}</span>
              </li>
            )}
            {price && (
              <li>
                <span>Price: {price}</span>
              </li>
            )}
          </ul>
        </div>
        {video_url ? (
          <div className={`video-post ${(classes && classes.video) || ''}`}>
            <VideoPlayer url={video_url} container_style={container_style} />
          </div>
        ) : (
          <div
            className={`blog-image ${(classes && classes.thumbnail) ||
              'default-img'}`}
          >
            <img
              src={thumbnail}
              className="img-responsive blog-thumbnail"
              alt=""
            />
          </div>
        )}
        <div className={`blog-content ${(classes && classes.content) || ''}`}>
          <p>
            <span dangerouslySetInnerHTML={{ __html: content }} />
          </p>
        </div>
      </section>
    );
  }
}
