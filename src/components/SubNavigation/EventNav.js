import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import { Nav, NavItem, NavDropdown } from 'react-bootstrap';
import NavWrap from '../NavWrap';
import CalendarSelector from '../CalendarSelector';
import './styles.scss';

export default ({ link, title, changeDate, selectTitle }) => (
  <StaticQuery
    query={graphql`
      query eventCategory {
        allWordpressWpEventCategory {
          edges {
            node {
              slug
              name
              link
            }
          }
        }
      }
    `}
    render={data => {
      let menus = data.allWordpressWpEventCategory.edges.map(obj => obj.node);
      menus = [{ name: 'All Events', link: '/events' }, ...menus];
      return (
        <section className="sub-navigation event-nav">
          <div className="pull-left">
            <h2>
              <Link
                to={link.replace(/https?:\/\/[^/]+/, '')}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </h2>
          </div>
          <Nav className="event-nav-links">
            <NavDropdown
              id="filter"
              className="drop-down-menu-list pull-right"
              title={selectTitle}
            >
              {menus.map(menu => (
                <NavWrap key={menu.link}>
                  <Link
                    to={menu.link.replace(/https?:\/\/[^/]+/, '')}
                    dangerouslySetInnerHTML={{
                      __html: menu.name
                    }}
                  />
                </NavWrap>
              ))}
            </NavDropdown>
            <NavItem className="pull-right calendar-container">
              <CalendarSelector callback={changeDate} />
            </NavItem>
          </Nav>
        </section>
      );
    }}
  />
);
