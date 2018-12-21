import React, { Component } from 'react';
import $ from 'jquery';
import * as FontAwesome from 'react-icons/lib/fa';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'gatsby';
import SearchForm from '../Forms/SearchForm';
import SocialLinks from '../SocialLinks';
import NavWrap from '../NavWrap';
import logo from '../../assets/white_hec.png';
import {
  getHeaderMenuObject,
  getSocialMenuObject,
  isServer
} from '../../utils/helperFunctions';
import './styles.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: {},
      navExpanded: false
    };
  }

  componentDidMount() {
    $('#main-nav > div:first-child').addClass('main-container');
  }

  componentWillReceiveProps(newProps) {
    const { slug } = this.props;
    if (slug !== newProps.slug) {
      this.closeNav();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.navExpanded) {
      this.closeNav();
    }
  }

  search = () => {
    this.close('#');
    const { searchFunc } = this.props;
    searchFunc();
  };

  open = url => {
    this.setState(prevState => {
      const state = { ...prevState };
      state.open[url] = true;
      return { open: state.open };
    });
  };

  close = url => {
    this.setState(prevState => {
      const state = { ...prevState };
      state.open[url] = false;
      return { open: state.open };
    });
  };

  toggle = url => {
    this.setState(prevState => {
      const state = { ...prevState };
      state.open[url] = !state.open[url];
      return { open: state.open };
    });
  };

  setNavExpanded = expanded => {
    this.setState({ navExpanded: expanded });
  };

  closeNav = () => {
    this.setState({ navExpanded: false });
  };

  getNavDropDown = (link, linkFunction, currentLink, i) => {
    const btnDisplay = link.btnClass || 'btn-secondary';

    return (
      <NavDropdown
        key={`top_link${i}`}
        className={`btn ${btnDisplay}`}
        title={link.label}
        id={`${link.label}-${i}`}
      >
        {link.children.map(menu => {
          const { url, label } = menu;
          const cleanUrl = url.replace(/https?:\/\/[^/]+/, '');
          return (
            <NavWrap key={url}>
              {url.match(/^\/\//) ? (
                <a
                  href={cleanUrl}
                  dangerouslySetInnerHTML={{
                    __html: label
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ) : (
                <Link
                  to={cleanUrl}
                  dangerouslySetInnerHTML={{
                    __html: label
                  }}
                />
              )}
            </NavWrap>
          );
        })}
      </NavDropdown>
    );
  };

  getNavItem = (link, linkFunction, currentLink, i) => {
    const { url, icon, label, iconPlacement, btnClass, toggle, onClick } = link;
    const cleanUrl = url.replace(/https?:\/\/[^/]+/, '');
    const btnDisplay = btnClass || 'btn-secondary';
    const clickFunction = toggle ? () => {} : onClick || linkFunction;
    const { open } = this.state;

    return open[url] ? (
      <NavWrap
        key={`top_link${i}`}
        className={`${
          currentLink === cleanUrl.replace(/\//g, '')
            ? `btn show ${btnDisplay}`
            : `btn  ${btnDisplay}`
        }`}
        onClick={() => clickFunction(cleanUrl)}
      >
        {toggle}
      </NavWrap>
    ) : (
      <NavWrap
        key={`top_link${i}`}
        className={`${
          currentLink === cleanUrl.replace(/\//g, '')
            ? `btn show ${btnDisplay}`
            : `btn  ${btnDisplay}`
        }`}
      >
        {icon && iconPlacement !== 'right' ? icon : ''}
        {url.match(/^\/\//) ? (
          <a
            href={cleanUrl}
            dangerouslySetInnerHTML={{
              __html: label
            }}
            target="_blank"
            rel="noopener noreferrer"
          />
        ) : (
          <Link
            to={cleanUrl}
            dangerouslySetInnerHTML={{
              __html: label
            }}
          />
        )}
      </NavWrap>
    );
  };

  getLinks = (links, linkFunction, currentLink) =>
    links.map(
      (link, i) =>
        link.children
          ? this.getNavDropDown(link, linkFunction, currentLink, i)
          : this.getNavItem(link, linkFunction, currentLink, i)
    );

  render() {
    const { currentPage, header, social, openLink } = this.props;
    const { navExpanded } = this.state;

    const isMobile = !isServer && window.innerWidth <= 1170;
    const style = isMobile
      ? { width: `${window.innerWidth - 50}px`, right: '12px' }
      : {};

    const topLinks = getHeaderMenuObject(header);
    const socialLinks = getSocialMenuObject(
      social,
      isMobile ? 15 : 25,
      'white'
    );

    const userAdmin = [
      {
        label: '',
        url: '#',
        btnClass: 'btn-secondary pull-right search-btn',
        icon: (
          <Button className="search-btn-icon" onClick={() => this.open('#')}>
            <FontAwesome.FaSearch
              className="search-icon"
              size="20"
              color="#444"
            />
          </Button>
        ),
        toggle: (
          <div>
            <div className="search-container" style={style}>
              <div className="row">
                <div className="search-input col-xs-10 no-padding">
                  <SearchForm callbackFunc={this.search} />
                </div>
                <Button
                  className="col-xs-2 text-center search-icon-container"
                  style={{ verticalAlign: 'middle' }}
                  onClick={() => this.search()}
                >
                  <FontAwesome.FaSearch className="search-icon" color="#222" />
                </Button>
              </div>
            </div>
            <Button className="gradient" onClick={() => this.close('#')} />
          </div>
        )
      }
    ];

    return (
      <section className="header">
        <Navbar
          inverse
          className="navbar-class"
          id="main-nav"
          onToggle={this.setNavExpanded}
          expanded={navExpanded}
        >
          <Navbar.Header className="navbar-header-class">
            <div className="top-logo">
              <Navbar.Brand className="navbar-brand-class">
                <Link to="/">
                  <img
                    className="header-logo img-responsive"
                    src={logo}
                    alt="HECTV logo"
                  />
                </Link>
              </Navbar.Brand>
            </div>
            <div className="brand-details">
              <div className="brand-text">
                <div>
                  St. Louis
                  {`'`} home of Education
                </div>
                <div>Arts, and Culture</div>
              </div>
              <SocialLinks links={socialLinks} />
            </div>
            <Navbar.Toggle className="nav-toggle " />
            <Nav onSelect={this.closeNav} className="user-admin pull-right">
              {this.getLinks(userAdmin, openLink, currentPage)}
            </Nav>
          </Navbar.Header>
          <div className="bottom-nav row">
            <Navbar.Collapse>
              <Nav
                onSelect={this.closeNav}
                className="pull-left top-navigation left-links"
              >
                {this.getLinks(topLinks, openLink, currentPage)}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </section>
    );
  }
}

Header.propTypes = {
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired
};
