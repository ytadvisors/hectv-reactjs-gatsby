import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';

import './styles.scss';

export default class PostHeader extends Component {
  constructor(props) {
    super(props);
    this.getLinks = this.getLinks.bind(this);
  }

  getLinks(page, links) {
    return (
      <ul className="link-list">
        {links.map((link, x) => (
          <li key={`link-${x}`}>
            <Link to={`${page}/${link.slug}`}>{link.name}</Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { page, title, links, menus, openLink } = this.props;
    return (
      <section className="post-header">
        <div className="row heading">
          <div className="col-md-12">
            <div className="pull-left">
              {title && (
                <h2>
                  <a
                    href="#"
                    onClick={() => openLink(page)}
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                </h2>
              )}
            </div>
            {menus.length > 0 && (
              <Navbar.Header className="pull-right menu-list navbar-nav">
                {menus.map((menu, x) => (
                  <Nav className="pull-right" key={`nav-${x}`}>
                    {menu.content}
                  </Nav>
                ))}
              </Navbar.Header>
            )}
          </div>
        </div>
        {this.getLinks(page, links)}
      </section>
    );
  }
}

PostHeader.propTypes = {
  links: PropTypes.array.isRequired,
  menus: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  openLink: PropTypes.func.isRequired
};
