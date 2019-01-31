import React, { Component } from 'react';
import $ from 'jquery';
import * as FontAwesome from 'react-icons/lib/fa';
import * as Material from 'react-icons/lib/md';
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
import { isLoggedIn } from '../../utils/session';
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
    this.mounted = true;
    $('#main-nav > div:first-child').addClass('main-container');
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  search = () => {
    this.setToggle('#', false);
    const { searchFunc } = this.props;
    searchFunc();
  };

  setToggle = (url, isOpen = true) => {
    if (this.mounted) {
      this.setState(prevState => {
        const state = { ...prevState };
        state.open[url] = isOpen;
        return { open: state.open };
      });
    }
  };

  setNavExpanded = expanded => {
    if (this.mounted) {
      this.setState({ navExpanded: expanded });
    }
  };

  closeNav = () => {
    if (this.mounted) {
      this.setState({ navExpanded: false });
    }
  };

  getNavDropDown = link => {
    const { url, label } = link;
    const btnDisplay = link.btnClass || 'btn-secondary';

    return (
      <NavDropdown
        key={`${label} ${url}`}
        className={`btn ${btnDisplay}`}
        title={label}
        id={url}
      >
        {link.children.map(menu => (
            <NavWrap key={`${menu.label} ${menu.url}`}>
              {this.getLink(menu)}
            </NavWrap>
          ))}
      </NavDropdown>
    );
  };

  getLink = link => {
    const { url, label, buttonClick } = link;
    const cleanUrl = url && url.replace(/https?:\/\/[^/]+/, '');
    const isRedirect = url && url.match(/^\/\//);
    if (buttonClick) {
      return (
        <Button
          onClick={buttonClick}
          dangerouslySetInnerHTML={{
            __html: label
          }}
        />
      );
    } if (isRedirect) {
      return (
        <a
          href={cleanUrl}
          dangerouslySetInnerHTML={{
            __html: label
          }}
          target="_blank"
          rel="noopener noreferrer"
        />
      );
    }
    return (
      <Link
        to={cleanUrl}
        dangerouslySetInnerHTML={{
          __html: label
        }}
      />
    );
  };

  getNavItem = link => {
    const { currentPage } = this.props;
    const { url, icon, label, iconPlacement, btnClass, toggle, onClick } = link;
    const cleanUrl = url.replace(/https?:\/\/[^/]+/, '');
    const btnDisplay = btnClass || 'btn-secondary';
    const clickFunction = toggle ? () => {} : onClick;
    const { open } = this.state;

    return open[url] ? (
      <NavWrap
        key={`${label} ${url}`}
        className={`${
          currentPage === cleanUrl.replace(/\//g, '')
            ? `btn show ${btnDisplay}`
            : `btn  ${btnDisplay}`
        }`}
        onClick={() => clickFunction(cleanUrl)}
      >
        {toggle}
      </NavWrap>
    ) : (
      <NavWrap
        key={`${label} ${url}`}
        className={`${
          currentPage === cleanUrl.replace(/\//g, '')
            ? `btn show ${btnDisplay}`
            : `btn  ${btnDisplay}`
        }`}
      >
        {icon && iconPlacement !== 'right' ? icon : ''}
        {label && this.getLink(link)}
      </NavWrap>
    );
  };

  getLinks = links =>
    links.map(
      link =>
        link.children ? this.getNavDropDown(link) : this.getNavItem(link)
    );

  render() {
    const { header, social, openSignin, logoutFunc } = this.props;
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
        url: '#',
        btnClass: 'btn-secondary pull-right search-btn',
        icon: (
          <Button
            className="search-btn-icon"
            onClick={() => this.setToggle('#', true)}
          >
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
            <Button
              className="gradient"
              onClick={() => this.setToggle('#', false)}
            />
          </div>
        )
      },
      {
        url: '#signin',
        btnClass: 'btn-secondary pull-right login',
        icon: !isLoggedIn() ? (
          <Button className="admin-btn-icon" onClick={openSignin}>
            <Material.MdPersonOutline
              className="search-icon"
              size="23"
              color="#fff"
            />
            <span>Sign In</span>
          </Button>
        ) : (
          this.getNavDropDown({
            url: '#',
            label: 'My Account',
            children: [
              {
                url: '/profile',
                label: 'Profile'
              },
              {
                buttonClick: logoutFunc,
                label: 'Logout'
              }
            ]
          })
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
              {this.getLinks(userAdmin)}
            </Nav>
          </Navbar.Header>
          <div className="bottom-nav row">
            <Navbar.Collapse>
              <Nav
                onSelect={this.closeNav}
                className="pull-left top-navigation left-links"
              >
                {this.getLinks(topLinks)}
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
