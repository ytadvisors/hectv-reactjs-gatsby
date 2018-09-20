import React, { Component } from 'react';
import moment from 'moment';
import playButton from './../../assets/play-button.png';
import {isServer, getExcerpt} from "./../../utils/helperFunctions"

import './styles.scss';

export default class Banner extends Component{

  getLiveVideos = (live_videos) => {
    const current_time  = moment(moment().format('MM/DD/YYYY'));
    return live_videos && live_videos.reduce((result, item) => {
        const {
          start_date,
          end_date
        } = item;
        let end_time = moment(new Date(end_date));
        let start_time = moment(new Date(start_date));
        if(current_time.isBetween(start_time, end_time)) {
          result = item;
          return result;
        }
        return result;
      }, {});
  };

  constructor(props){
    super(props);
    this.resize = this.resize.bind(this);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    if(!isServer)
      window.addEventListener('resize', this.resize);
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  }

  componentWillUnmount() {
    if(!isServer)
      window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  }

  render(){
    const {
      live_videos
    } = this.props;

    const {
      title,
      start_date,
      url
    } = this.getLiveVideos(live_videos);

    return (
      <section className="banner">
        {title && url && start_date &&
        <div className="content">
          <div className="container">
            <ul className="live-info">
              <li className="watch vcenter no-mobile"><i>Watch</i></li>
              <li className="live vcenter">Live</li>
              <li className="play vcenter no-mobile">
                <img src={playButton} className="play-icon"/>
              </li>
              <li className="banner-link vcenter">
                <a href={url} target="_blank">
                  <div>
                    {getExcerpt(title, this.state.isMobile ? 25 : 150)}
                  </div>
                  <div className="breaker">.&nbsp;</div>
                  <div>
                    {moment(new Date(start_date)).format('MMM, Do hh:mm a z')} CT
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        }
      </section>
    )
  }
}
