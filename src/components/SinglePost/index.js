import React, { Component } from 'react';
import moment from 'moment';
import $ from 'jquery';
import * as Material from 'react-icons/lib/md';
import LazyLoad from 'react-lazyload';
import VideoPlayer from '../VideoPlayer/index';
import ShareSocialLinks from '../ShareSocialLinks';
import { getEventDate, cleanUrl, isServer } from '../../utils/helperFunctions';
import PodcastLinks from '../PodcastLinks';
import './styles.scss';

export default class SinglePost extends Component {
  componentDidMount() {
    /* eslint-disable global-require */
    require('slick-carousel/slick/slick'); // required here for build to work

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

    this.resizeVideos();
    window.addEventListener('resize', this.resizeVideos);
  }

  componentWillUnmount() {
    if (!isServer) window.removeEventListener('resize', this.resizeVideos);
  }

  resizeVideos = () => {
    const isMobile = !isServer && $(window).width() <= 1170;
    if (isMobile) {
      $(`iframe`).each(function() {
        const src = $(this).attr('src');
        if (src.match(/youtube\.com/g)) {
          let width = $(window).width();
          $(this).attr('width', Math.floor((width -= width * 0.32)));
          $(this).attr('height', Math.floor(width / 2));
        }
      });
    } else {
      $(`iframe`).each(function() {
        const src = $(this).attr('src');
        if (src.match(/youtube\.com/g)) {
          const width = 1000;
          $(this).attr('width', width - 170);
          $(this).attr('height', Math.floor(width / 2));
        }
      });
    }
  };

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
      classes,
      podcasts
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
        <PodcastLinks podcasts={podcasts} />
        <div className={`blog-content ${(classes && classes.content) || ''}`}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    );
  }
}
