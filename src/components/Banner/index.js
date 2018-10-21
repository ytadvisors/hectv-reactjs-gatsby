import React, { Component } from 'react';
import moment from 'moment';
import playButton from './../../assets/play-button.png';
import {isServer, getExcerpt, cleanUrl} from "./../../utils/helperFunctions"
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
    const formated_url = cleanUrl(url);
    return (
      <section className="banner">
        {post_title && url && start_date &&
        <div className="content">
          <div className="container">
            <ul className="live-info">
              <li className="watch vcenter no-mobile">
                <Link to={formated_url}>
                  <i>Watch</i>
                </Link>
              </li>
              <li className="live vcenter">
                <Link to={formated_url}>
                  Live
                </Link>
              </li>
              <li className="play vcenter no-mobile">
                <Link to={formated_url}>
                  <img src={playButton} className="play-icon"/>
                </Link>
              </li>
              <li className="banner-link vcenter">
                <Link to={formated_url}>
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
