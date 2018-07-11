import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';

export default class SocialLinks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { links } = this.props;
    return (
      <ul className="social-links">
        {links.map((social, x) => (
          <li key={`social-${x}`}>
            <a href={social.link} target="_blank">
              {social.icon}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

SocialLinks.propTypes = {
  links: PropTypes.array.isRequired
};
