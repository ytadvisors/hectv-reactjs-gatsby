import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './modules.scss';

export default class BottomNav extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { menus, title } = this.props;
    return (
      <section className="post-bottom-nav">
        <div className="row">
          <div className="col-md-12">
            {
              <ul>
                <li className="title">{title}</li>
                {menus.map((menu, x) => (
                  <li key={`bottom-nav-${x}`}>
                    <Link to={menu.url.replace(/https?:\/\/[^/]+/, '')}>
                      {menu.title}
                    </Link>
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>
      </section>
    );
  }
}

BottomNav.propTypes = {
  menus: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};
