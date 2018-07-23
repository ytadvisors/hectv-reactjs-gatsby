import React from 'react';
import { Link, StaticQuery, graphql  } from 'gatsby';
import NavWrap from './../../components/NavWrap';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import './modules.scss';

export default (props) => {
  const { slug, link, title } = props;
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
            <div className="pull-left">
              <h2>
                <Link to={link.replace(/https?:\/\/[^/]+/, '')}
                      dangerouslySetInnerHTML={{__html: title}}
                />
              </h2>
            </div>
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

