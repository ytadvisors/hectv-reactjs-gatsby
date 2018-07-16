import React, {Component} from 'react';
import { StaticQuery, graphql } from "gatsby"


import "./styles.scss"
import ProgramViewer from './../../components/ProgramViewer';
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";


export default ({children, style, category_slug}) => {
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
        return <section>
          <Header header={header} social={social}/>
            <ProgramViewer style={style}>
              {children}
            </ProgramViewer>
          <Footer footer={footer} social={social}/>
        </section>
      }
    }
  />
}
