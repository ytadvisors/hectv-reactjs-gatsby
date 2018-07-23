import React, {Component}  from 'react';
import * as Material from 'react-icons/lib/md';

import './styles.scss';
import VideoPlayer from '../VideoPlayer/index';
import LazyLoad from 'react-lazyload';

export default class SinglePost extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const container_style = { padding: '0' };
    const {
      post: {
        date,
        title,
        thumbnail,
        content,
        event_link,
        acf: {
          youtube_id,
          web_address,
          event_price,
          venue,
          event_dates,
          vimeo_id,
          related_posts,
          post_events,
        }
      },
      hideTitle,
      classes
    } = this.props;

    return (
      <section className="post-container">
        <div className="col-md-12 no-padding">
          {!hideTitle && <h2 dangerouslySetInnerHTML={{ __html: title }} />}
          <ul className="post-details">
            {venue && (
              <li>
                <Material.MdLocationOn size="25" color="#4ea2ea" />
                <span dangerouslySetInnerHTML={{ __html: venue }} />
              </li>
            )}
            {web_address && (
              <li>
              <span>
                <a href={web_address} target="_blank">
                  {web_address}
                </a>
              </span>
              </li>
            )}
            {date && (
              <li>
                <span>{date}</span>
              </li>
            )}
            {event_price && (
              <li>
                <span>Price: {event_price}</span>
              </li>
            )}
          </ul>
        </div>
        {youtube_id || vimeo_id ? (
          <div className={`video-post ${(classes && classes.video) || ''}`}>
            <VideoPlayer url={
              youtube_id
                ? `https://youtu.be/${youtube_id}`
                : `https://vimeo.com/${vimeo_id}`
            } container_style={container_style} />
          </div>
        ) : (
          <div
            className={`blog-image ${(classes && classes.thumbnail) ||
            'default-img'}`}
          >
            <LazyLoad height={500}>
              <img
                src={thumbnail}
                className="img-responsive blog-thumbnail"
                alt=""
              />
            </LazyLoad>
          </div>
        )}
        <div className={`blog-content ${(classes && classes.content) || ''}`}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    );
  }
}

