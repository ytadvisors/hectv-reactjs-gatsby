import React from 'react';
import { StaticQuery, graphql } from "gatsby"

import "./modules.scss"
import ProgramViewer from './../ProgramViewer';
import Header from "./../Header";
import Footer from "./../Footer";
import Transition from "./../Transition"
import BottomNav from "../BottomNav/index";


export default ({children, style, slug , showBottomNav}) => {
  return <StaticQuery
    query={graphql`
           query MenuQuery {
             allWordpressWpApiMenusMenusItems {
                edges {
                  node {
                    name
                    count
                    items{
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
    render={
      data => {
        const menus = data.allWordpressWpApiMenusMenusItems.edges;
        const header = menus.reduce((result, menu) => menu.node.name === "Header" ? menu.node.items : result);
        const footer = menus.reduce((result, menu) => menu.node.name === "Footer" ? menu.node.items : result);
        const social = menus.reduce((result, menu) => menu.node.name === "Social" ? menu.node.items : result);
        const bottomNav = menus.reduce((result, menu) => menu.node.name === "BottomNav" ? menu.node.items : result);
        return <section>
          <Header header={header} social={social} page={slug}/>
            <ProgramViewer style={style}>
              <Transition>
                {children}
                {showBottomNav && <BottomNav menus={bottomNav && bottomNav.node.items} title="more from"/>}
              </Transition>
            </ProgramViewer>
          <Footer footer={footer} social={social}/>
        </section>
      }
    }
  />
}
