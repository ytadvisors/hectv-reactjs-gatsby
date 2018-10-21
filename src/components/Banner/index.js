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
      post_title = "",
      acf: {
        start_date,
        url
      } = {}
    } = live_videos.length > 0 ? live_videos[0] : {};
    let formated_url = url;
    let redirect = true;
    if(url && url.indexOf(process.env.GATSBY_SITE_HOST) !== -1) {
      formated_url = cleanUrl(url);
      redirect = false;
    }

    const excerpt = <div>
      <div>
        {getExcerpt(post_title, this.state.isMobile ? 25 : 150)}
      </div>
      <div className="breaker">.&nbsp;</div>
      <div>
        {moment(new Date(start_date)).format('MMM, Do hh:mm a z')} CT
      </div>
    </div>
    return (
      <section className="banner">
        {post_title && url && start_date &&
        <div className="content">
          <div className="container">
            <ul className="live-info">
              <li className="watch vcenter no-mobile">
                {
                  redirect ? <a href = {formated_url} target="_blank"><i>Watch</i></a>
                    : <Link to={formated_url}><i>Watch</i></Link>
                }

              </li>
              <li className="live vcenter">
                {
                  redirect ? <a href = {formated_url} target="_blank">Live</a>
                    : <Link to={formated_url}>Live</Link>
                }
              </li>
              <li className="play vcenter no-mobile">
                {
                  redirect ? <a href = {formated_url} target="_blank">
                    <img src={playButton} className="play-icon"/>
                  </a>
                  : <Link to={formated_url}>
                    <img src={playButton} className="play-icon"/>
                  </Link>
                }
              </li>
              <li className="banner-link vcenter">
                {
                  redirect ? <a href = {formated_url} target="_blank"> {excerpt} </a>
                    : <Link to={formated_url}> {excerpt} </Link>
                }
              </li>
            </ul>
          </div>
        </div>
        }
      </section>
    )
  }
}
