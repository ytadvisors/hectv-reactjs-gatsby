import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export default class SideNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return <section className="side-navigation">{children}</section>;
  }
}
