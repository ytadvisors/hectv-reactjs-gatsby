import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NavWrap extends Component {
  render() {
    const {
      active,
      activeKey,
      activeHref,
      onSelect,

      children,

      ...otherProps
    } = this.props;
    return (
      <li role="presentation" {...otherProps}>
        {children}
      </li>
    );
  }
}
