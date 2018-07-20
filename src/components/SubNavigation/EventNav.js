import React from 'react';
import { Link, StaticQuery, graphql  } from 'gatsby';
import NavWrap from './../../components/NavWrap';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import './styles.scss';

export default (props) => {
  const { slug } = props;
  return (
    <StaticQuery
      query={graphql`
           query eventCategory {
             allWordpressWpEventCategory {
              edges{
                node{
                  slug
                  name
                  link
                }
              }
            }
          }
        `}
      render={
        data => {
          const menus = data.allWordpressWpEventCategory.edges;
          return <section className="sub-navigation">
            <NavDropdown id = "filter" className="drop-down-menu-list pull-right" title="Filter Events">
              {menus.map((menu, x) => (
                <NavWrap
                  key={`menu-${x}`}
                >
                  <Link to={menu.node.link.replace(/https?:\/\/[^/]+/, '')} dangerouslySetInnerHTML={{
                    __html: menu.node.name
                  }}>
                  </Link>
              </NavWrap>
              ))}
            </NavDropdown>
          </section>
        }
      }
    />
  );
}

