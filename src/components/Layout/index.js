import React from 'react';
import { StaticQuery, graphql } from "gatsby"
import "./styles.scss"
import ProgramViewer from './../../components/ProgramViewer';
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
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
              {children}
              {showBottomNav && <BottomNav menus={bottomNav && bottomNav.node.items} title="more from"/>}
            </ProgramViewer>
          <Footer footer={footer} social={social}/>
        </section>
      }
    }
  />
}
