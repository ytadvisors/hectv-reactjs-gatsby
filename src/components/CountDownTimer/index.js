import React, { Component } from 'react';
// import moment from 'moment';

export default class CountDownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // now: moment()
      /* dateTo: moment(),
      day: '0',
      hour: '0',
      min: '0',
      sec: '0' */
    };
  }
  /*
  componentDidMount() {
    this.countdown = setInterval(this.timer, 1000);
    this.setState({
      // ...this.state,
      dateTo: this.props.dateTo
    });
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }
  */

  /*
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dateTo !== this.props.dateTo) {
      this.setState({});
    }
  } */
  /*
  timer() {
    if (!this.state || !this.state.dateTo) {
      return;
    }
    const now = moment();
    const sec = this.state.dateTo.diff(now, 'seconds') % 60;
    const min = this.state.dateTo.diff(now, 'minutes') % 60;
    const hour = this.state.dateTo.diff(now, 'hours') % 24;
    const day = this.state.dateTo.diff(now, 'days');

    this.setState({
      now,
      day: day < 10 ? `0${day}` : day,
      hour: hour < 10 ? `0${hour}` : hour,
      min: min < 10 ? `0${min}` : min,
      sec: sec < 10 ? `0${sec}` : sec
    });
  }

  */

  /*

  renderDays() {
    if (this.state.day < 1) {
      return `${this.state.day  }Days`;
    } if (this.state.day == 1) {
      return `${this.state.day  }day`;
    } 
      return '';
    
  }

  */

  render() {
    return (
      <div>
        Yay Time
        {/* {this.renderDays()} {this.state.hour} : {this.state.min}: 
    {this.state.sec}  */}
        {
          //! startDate ? 'Starts ' : 'Started '
        }
        {/* moment(new Date(this.props.beginDate))
          .endOf('minutes')
        .fromNow() */}
      </div>
    );
  }
}
