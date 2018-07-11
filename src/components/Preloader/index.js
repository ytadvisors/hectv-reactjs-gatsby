import React, { Component } from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';

export default class Preloader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { is_loading } = this.props;
    return (
      <header style={{ background: is_loading ? 'rgba(0,101,188,.7)' : '' }}>
        <LoadingBar style={{ height: '4px' }} />
        {is_loading && <div className="overlay" />}
      </header>
    );
  }
}

Preloader.propTypes = {
  is_loading: PropTypes.bool.isRequired
};
