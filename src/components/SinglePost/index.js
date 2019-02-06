import React, { Component } from 'react';
import moment from 'moment';
import $ from 'jquery';
import 'slick-carousel/slick/slick';
import * as Material from 'react-icons/lib/md';
import LazyLoad from 'react-lazyload';
import VideoPlayer from '../VideoPlayer/index';
import ShareSocialLinks from '../ShareSocialLinks';
import { getEventDate, cleanUrl } from '../../utils/helperFunctions';

import './styles.scss';

export default class SinglePost extends Component {
  componentDidMount() {
    $('.gallery-columns-3 br').remove();
    $('.gallery-columns-3').slick({
      dots: false,
      pauseOnHover: false,
      swipe: false,
      swipeToSlide: false,
      touchMove: false,
      arrows: true,
      fade: false,
      autoplay: true,
      infinite: true,
      slidesToScroll: 1,
      autoplaySpeed: 4000,
      slidesToShow: 3,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  render() {
    const {
      post: {
        title,
        thumbnail,
        content,
        link = '',
        acf: {
          youtubeId,
          webAddress,
          eventPrice,
          venue,
          vimeoId,
          eventDates,
          embedUrl = ''
        } = {}
      },
      pageTitle,
      pageUrl,
      showShareIcons,
      liveVideos = [],
      hideTitle,
      classes
    } = this.props;
    const containerStyle = { padding: '0' };
    const { acf: { endDate, displayDate, url } = {} } =
      liveVideos.length > 0 ? liveVideos[0] : {};

    const isPlaying = moment().isBetween(
      moment(displayDate, 'MM/DD/YYYY h:mm a', true),
      moment(endDate, 'MM/DD/YYYY h:mm a', true)
    );

    const isLiveVideo =
      isPlaying &&
      url &&
      cleanUrl(url.replace(/\/$/, '')) === cleanUrl(link.replace(/\/$/, ''));

    return (
      <section className="post-container">
        <div className="col-md-12 no-padding">
          {!hideTitle && <h2 dangerouslySetInnerHTML={{ __html: title }} />}

          {showShareIcons && (
            <div className="row share-container">
              <ShareSocialLinks url={pageUrl} title={pageTitle} />
            </div>
          )}
          <ul className="post-details">
            {venue && (
              <li>
                <Material.MdLocationOn size="25" color="#4ea2ea" />
                <span dangerouslySetInnerHTML={{ __html: venue }} />
              </li>
            )}
            {webAddress && (
              <li>
                <span>
                  <a
                    href={webAddress}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {webAddress}
                  </a>
                </span>
              </li>
            )}
            {eventDates &&
              getEventDate(eventDates, 'MMM D, hh:mm a', true).map(event => (
                <li key={event}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: event
                    }}
                  />
                </li>
              ))}
            {eventPrice && (
              <li>
                <span>Price: {eventPrice}</span>
              </li>
            )}
          </ul>
        </div>
        {youtubeId || vimeoId || embedUrl ? (
          <div className={`video-post ${(classes && classes.video) || ''}`}>
            <VideoPlayer
              url={
                youtubeId
                  ? `https://youtu.be/${youtubeId}`
                  : `https://vimeo.com/${vimeoId}`
              }
              containerStyle={containerStyle}
              embedUrl={isLiveVideo && embedUrl}
            />
          </div>
        ) : (
          <div
            className={`blog-image ${(classes && classes.thumbnail) ||
              'default-img'}`}
          >
            {thumbnail && (
              <LazyLoad height={500}>
                <img
                  src={thumbnail}
                  className="img-responsive blog-thumbnail"
                  alt="thumbnail"
                />
              </LazyLoad>
            )}
          </div>
        )}
        <div className={`blog-content ${(classes && classes.content) || ''}`}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    );
  }
}
