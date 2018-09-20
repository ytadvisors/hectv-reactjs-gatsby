import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import SearchForm from './../../components/Forms/SearchForm';
import SocialLinks from './../../components/SocialLinks';
import NavWrap from './../../components/NavWrap';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { isServer } from './../../utils/helperFunctions';
import { Link } from "gatsby"
import logo from './../../assets/white_hec.png';
import $ from 'jquery';

import {
  getHeaderMenuObject,
  getSocialMenuObject
} from './../../utils/helperFunctions';
import './styles.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.getLinks = this.getLinks.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.getNavDropDown = this.getNavDropDown.bind(this);
    this.getNavItem = this.getNavItem.bind(this);
    this.setNavExpanded = this.setNavExpanded.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      open: {},
      navExpanded: false
    };
  }
  search() {
    this.close('#');
    const { searchFunc } = this.props;
    searchFunc();
  }

  open(url) {
    let state = this.state;
    state.open[url] = true;
    this.setState({ open: state.open });
  }

  close(url) {
    let state = this.state;
    state.open[url] = false;
    this.setState({ open: state.open });
  }

  toggle(url) {
    let state = this.state;
    state.open[url] = !state.open[url];
    this.setState({ open: state.open });
  }

  setNavExpanded(expanded) {
    this.setState({ navExpanded: expanded });
  }

  closeNav() {
    this.setState({ navExpanded: false });
  }

  componentWillReceiveProps(newProps) {
    if(this.props.slug !== newProps.slug){
      console.log(this.props);
      this.closeNav();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.navExpanded) {
      this.closeNav();
    }
  }

  componentDidMount() {
    $('#main-nav > div:first-child').addClass('main-container');
  }

  getNavDropDown(link, linkFunction, current_link, i) {
    const { url, label, btn_class } = link;
    let clean_url = url.replace(/https?:\/\/[^/]+/, '');
    let btn_display = btn_class ? btn_class : 'btn-secondary';

    return (
      <NavDropdown
        key={`top_link${i}`}
        className={`btn ${btn_display}`}
        title={label}
        id={`${label}-${i}`}
      >
        {link.children.map((menu, x) => {
          const { url, label } = menu;
          let clean_url = url.replace(/https?:\/\/[^/]+/, '');
          return (
            <NavWrap
              key={`menu-${x}`}
            >
              <Link to={clean_url} dangerouslySetInnerHTML={{
                __html: label
              }} >
              </Link>
            </NavWrap>
          );
        })}
      </NavDropdown>
    );
  }

  getNavItem(link, linkFunction, current_link, i) {
    const {
      url,
      icon,
      label,
      icon_placement,
      btn_class,
      toggle,
      onClick
    } = link;
    let clean_url = url.replace(/https?:\/\/[^/]+/, '');
    let btn_display = btn_class ? btn_class : 'btn-secondary';
    let clickFunction = toggle ? () => {} : onClick || linkFunction;

    return this.state.open[url] ? (
      <NavWrap
        key={`top_link${i}`}
        className={`${current_link === clean_url.replace(/\//g, '')
          ? `btn show ${btn_display}`
          : `btn  ${btn_display}`}`}
        onClick={() => clickFunction(clean_url)}
      >
        {toggle}
      </NavWrap>
    ) : (
      <NavWrap
        key={`top_link${i}`}
        className={`${current_link === clean_url.replace(/\//g, '')
          ? `btn show ${btn_display}`
          : `btn  ${btn_display}`}`}
      >
        {icon && icon_placement !== 'right' ? icon : ''}
        <Link to={clean_url} dangerouslySetInnerHTML={{
          __html: label
        }} >
        </Link>
      </NavWrap>
    );
  }

  getLinks(links, linkFunction, current_link) {
    return links.map(
      (link, i) =>
        link.children
          ? this.getNavDropDown(link, linkFunction, current_link, i)
          : this.getNavItem(link, linkFunction, current_link, i)
    );
  }

  render() {
    const {
      current_page,
      header,
      social,
      openLink
    } = this.props;

    const isMobile = !isServer && window.innerWidth <= 1170;
    let style = isMobile
      ? { width: window.innerWidth - 50 + 'px', right: '12px' }
      : {};

    let top_links = getHeaderMenuObject(header);
    let social_links = getSocialMenuObject(social, isMobile ? 15 : 25, 'white');

    let user_admin = [
      {
        label: '',
        url: '#',
        btn_class: 'btn-secondary pull-right search-btn',
        icon: (
          <div className="search-btn-icon" onClick={() => this.open('#')}>
            <FontAwesome.FaSearch
              className="search-icon"
              size="20"
              color="#444"
            />
          </div>
        ),
        toggle: (
          <div>
            <div className="search-container" style={style}>
              <div className="row">
                <div className="search-input col-xs-10 no-padding">
                  <SearchForm callbackFunc={this.search} />
                </div>
                <div
                  className="col-xs-2 text-center search-icon-container"
                  style={{ verticalAlign: 'middle' }}
                  onClick={() => this.search()}
                >
                  <FontAwesome.FaSearch className="search-icon" color="#222" />
                </div>
              </div>
            </div>
            <div className="gradient" onClick={() => this.close('#')} />
          </div>
        )
      }
    ];

    return (
      <section className="header">
        <Navbar
          ref="nav"
          inverse
          className="navbar-class"
          id="main-nav"
          onToggle={this.setNavExpanded}
          expanded={this.state.navExpanded}
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
                <div>St. Louis' home of Education</div>
                <div>Arts, and Culture</div>
              </div>
              <SocialLinks links={social_links} />
            </div>
            <Navbar.Toggle className={`nav-toggle `} />
            <Nav onSelect={this.closeNav} className="user-admin pull-right">
              {this.getLinks(user_admin, openLink, current_page)}
            </Nav>
          </Navbar.Header>
          <div className="bottom-nav row">
            <Navbar.Collapse>
              <Nav
                onSelect={this.closeNav}
                className="pull-left top-navigation left-links"
              >
                {this.getLinks(top_links, openLink, current_page)}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </section>
    );
  }
}
Header.propTypes = {
  header: PropTypes.array.isRequired,
  social: PropTypes.array.isRequired
};
