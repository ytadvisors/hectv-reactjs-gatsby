import React, { Component } from 'react';
import RSlider from 'react-slick';
import PropTypes from 'prop-types';
import './modules.scss';

export default class Slider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      fade: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const { video_list } = this.props;
    return (
      <section className="slider">
        <RSlider className="container no-padding slider" {...settings}>
          {video_list.map((video, x) => (
            <div className="slider-container" key={`slide-${x}`}>
              <div className="blue-gradient" />
              <img src={video.thumbnail} />
            </div>
          ))}
        </RSlider>
      </section>
    );
  }
}

Slider.propTypes = {
  video_list: PropTypes.array.isRequired
};
