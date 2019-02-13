import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'gatsby';
import playButton from '../../assets/play-button.png';
import { isServer, getExcerpt, cleanUrl } from '../../utils/helperFunctions';
import CountDownTimer from '../CountDownTimer';

import './styles.scss';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    if (!isServer) window.addEventListener('resize', this.resize);
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  }

  resize = () => {
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  };

  render() {
    const { liveVideos = [] } = this.props;
    const { isMobile } = this.state;

    const { postTitle = '', acf: { startDate, url } = {} } =
      liveVideos.length > 0 ? liveVideos[0] : {};
    let formattedUrl = url;
    let redirect = true;
    if (url && url.indexOf(process.env.GATSBY_SITE_HOST) !== -1) {
      formattedUrl = cleanUrl(url);
      redirect = false;
    }

    const excerpt = (
      <div>
        <div>{getExcerpt(postTitle, isMobile ? 25 : 150)}</div>
        <div className="breaker">.&nbsp;</div>
        <div />

        <div>
          {/* <CountDownTimer deadline={moment(new Date(startDate))} /> */}
          Starts in{' '}
          <CountDownTimer deadline="Sun Jan 22 2019 22:00:28 GMT-0600" />
        </div>
      </div>
    );

    console.log('**************', moment());

    return (
      <section className="banner">
        <CountDownTimer deadline="Sun Jan 22 2019 22:00:28 GMT-0600" />
        {postTitle &&
          url &&
          startDate && (
            <div className="content">
              <div className="container">
                <ul className="live-info">
                  <li className="watch vcenter no-mobile">
                    {redirect ? (
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i>Watch</i>
                      </a>
                    ) : (
                      <Link to={formattedUrl}>
                        <i>Watch</i>
                      </Link>
                    )}
                  </li>
                  <li className="live vcenter">
                    {redirect ? (
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live
                      </a>
                    ) : (
                      <Link to={formattedUrl}>Live</Link>
                    )}
                  </li>
                  <li className="play vcenter no-mobile">
                    {redirect ? (
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={playButton}
                          className="play-icon"
                          alt="play"
                        />
                      </a>
                    ) : (
                      <Link to={formattedUrl}>
                        <img
                          src={playButton}
                          className="play-icon"
                          alt="play"
                        />
                      </Link>
                    )}
                  </li>
                  <li className="banner-link vcenter">
                    {redirect ? (
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        {excerpt}{' '}
                      </a>
                    ) : (
                      <Link to={formattedUrl}> {excerpt} </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          )}
      </section>
    );
  }
}
