import React  from 'react';
import * as Material from 'react-icons/lib/md';

import './styles.scss';
import VideoPlayer from '../VideoPlayer/index';

export default (props) => {
  const container_style = { padding: '0' };
  const {
    post: {
      date,
      title,
      thumbnail,
      content,
      event_link
    },
    classes
  } = props;

  let temp = { youtube_id : null,
    web_address: null,
    event_price: null,
    venue: null,
    event_dates: null,
    vimeo_id : null };

  const {
    youtube_id,
    web_address,
    event_price,
    venue,
    event_dates,
    vimeo_id
  } = props.post.acf || temp;

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
      ) : (classes && classes.thumbnail &&
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
