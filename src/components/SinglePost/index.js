import React, {Component}  from 'react';
import * as Material from 'react-icons/lib/md';

import './styles.scss';
import VideoPlayer from '../VideoPlayer/index';
import {  getEventDate, getLiveVideos, cleanUrl } from './../../utils/helperFunctions';
import LazyLoad from 'react-lazyload';

export default class SinglePost extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const container_style = { padding: '0' };
    const {
      post: {
        title,
        thumbnail,
        content,
        link = "",
        acf : {
          youtube_id,
          web_address,
          event_price,
          venue,
          vimeo_id,
          event_dates,
          embed_url = ""
        } = {}
      },
      live_videos = [],
      hideTitle,
      classes
    } = this.props;

    const {
      url = ""
    } = getLiveVideos(live_videos) || {};
    const is_live_video = cleanUrl(url.replace(/\/$/, "")) === cleanUrl(link.replace(/\/$/, ""));
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
            {event_dates && (
              <li>
                <span dangerouslySetInnerHTML={{ __html: getEventDate(event_dates) }} />
              </li>
            )}
            {event_price && (
              <li>
                <span>Price: {event_price}</span>
              </li>
            )}
          </ul>
        </div>
        {youtube_id || vimeo_id || embed_url ? (
          <div className={`video-post ${(classes && classes.video) || ''}`}>
            <VideoPlayer url={ youtube_id
                ? `https://youtu.be/${youtube_id}`
                : `https://vimeo.com/${vimeo_id}` }
              container_style={container_style}
              is_live_video={is_live_video}
              embed_url={embed_url}
            />
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

