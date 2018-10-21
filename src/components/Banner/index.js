import React, { Component } from 'react';
import moment from 'moment';
import playButton from './../../assets/play-button.png';
import {isServer, getExcerpt, getLiveVideos} from "./../../utils/helperFunctions"
import {Link} from "gatsby";

import './styles.scss';


export default class Banner extends Component{

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
      live_videos = []
    } = this.props;

    const {
      post_title,
      acf: {
        start_date,
        url
      } = {}
    } = live_videos.length > 0 ? live_videos[0] : {};

    return (
      <section className="banner">
        {post_title && url && start_date &&
        <div className="content">
          <div className="container">
            <ul className="live-info">
              <li className="watch vcenter no-mobile">
                <a href={url} target="_blank">
                  <i>Watch</i>
                </a>
              </li>
              <li className="live vcenter">
                <Link to={url}>
                  Live
                </Link>
              </li>
              <li className="play vcenter no-mobile">
                <Link to={url}>
                  <img src={playButton} className="play-icon"/>
                </Link>
              </li>
              <li className="banner-link vcenter">
                <Link to={url}>
                  <div>
                    {getExcerpt(post_title, this.state.isMobile ? 25 : 150)}
                  </div>
                  <div className="breaker">.&nbsp;</div>
                  <div>
                    {moment(new Date(start_date)).format('MMM, Do hh:mm a z')} CT
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        }
      </section>
    )
  }
}
