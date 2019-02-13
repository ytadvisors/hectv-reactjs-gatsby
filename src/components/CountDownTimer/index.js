import React, { Component } from 'react';
import moment from 'moment';

export default class CountDownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: '0',
      hours: '0',
      minutes: '0',
      seconds: '0'
    };
  }

  componentDidMount() {
    this.mounted = true;
    // this.loadLive();
    this.getTimeUntil();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /*
  componentWillMount() {
    const { deadline } = this.props;
    this.getTimeUntil(deadline);
  }
  */

  /*
  componentDidMount() {
    const { deadline } = this.props;
    setInterval(() => this.getTimeUntil(deadline), 1000);
  }
  */

  getTimeUntil() {
    if (this.mounted) {
      const { deadline } = this.props;
      const now = moment();
      const time = moment(new Date(deadline)) - now;
      // const time = Date.parse(deadline) - Date.parse(new Date());

      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));

      this.setState({
        days: days < 10 ? `0${days}` : days,
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds
      });
      setTimeout(() => {
        this.getTimeUntil(deadline);
      }, 1000);
    }
  }

  renderDays() {
    const { days } = this.state;
    if (days > 1) {
      return `${days}Days`;
    }
    if (days === 1) {
      return `${days}day`;
    }
    return '';
  }

  render() {
    const { hours, minutes, seconds } = this.state;
    return (
      <span>
        {this.renderDays()} {hours} Hours {minutes} Minutes {seconds} Seconds
      </span>
    );
  }
}
