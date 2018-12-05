import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import './styles.scss';
import ProgramViewer from '../ProgramViewer';
import HeaderContainer from '../../containers/HeaderContainer';
import Footer from '../Footer';
import Transition from '../Transition';
import BottomNav from '../BottomNav/index';

export default props => {
  const { children, slug, showBottomNav, liveVideos } = props;
  return (
    <StaticQuery
      query={graphql`
        query MenuQuery {
          allWordpressWpApiMenusMenusItems {
            edges {
              node {
                name
                count
                items {
                  title
                  url
                  wordpress_children {
                    wordpress_id
                    wordpress_parent
                    title
                    url
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        const menus = data.allWordpressWpApiMenusMenusItems.edges;
        const header = menus.reduce(
          (result, menu) =>
            menu.node.name === 'Header' ? menu.node.items : result
        );
        const footer = menus.reduce(
          (result, menu) =>
            menu.node.name === 'Footer' ? menu.node.items : result
        );
        const social = menus.reduce(
          (result, menu) =>
            menu.node.name === 'Social' ? menu.node.items : result
        );
        const bottomNav = menus.reduce(
          (result, menu) =>
            menu.node.name === 'BottomNav' ? menu.node.items : result
        );
        return (
          <section>
            <HeaderContainer
              header={header}
              social={social}
              page={slug}
              liveVideos={liveVideos}
              {...props}
            />
            <ProgramViewer {...props}>
              <Transition>
                {children}
                {showBottomNav && (
                  <BottomNav
                    menus={bottomNav && bottomNav.node.items}
                    title="more from"
                  />
                )}
              </Transition>
            </ProgramViewer>
            <Footer footer={footer} social={social} />
          </section>
        );
      }}
    />
  );
};
