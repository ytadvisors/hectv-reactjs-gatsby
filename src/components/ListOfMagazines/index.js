import React  from 'react';
import { Link } from 'react-router-dom';
import { StaticQuery, graphql } from "gatsby"

import './styles.scss';

export default () => {
  return (
    <section className="list-of-magazines">
      <div className="title">
        <div>
          <b>
            <Link to="/magazines">HEC-TV Magazine</Link>
          </b>
        </div>
      </div>
      <ul className="magazine-list">
        <StaticQuery
          query={graphql`
             query listMagazines {
               allWordpressWpMagazine (limit :5 ){
                  edges {
                    node {
                      title
                      link
                      acf{
                        cover_image
                      }
                    }
                  }
                }
             }
          `}
          render={
            data => {
              const magazines = data.allWordpressWpMagazine.edges;
              return magazines.map(({node: {title, link, acf: {cover_image} }}, x) =>
                <li key={`event-${x}`}>
                  <Link to={link.replace(/https?:\/\/[^/]+/, '')}>
                    <div className="row">
                      <div className="magazine-img col-xs-4 ">
                        <img src={cover_image} className="img-responsive"/>
                      </div>
                      <div
                        className="magazine-info col-xs-8"
                        dangerouslySetInnerHTML={{__html: title}}
                      />
                    </div>
                  </Link>
                </li>
              )
            }
          }
          />
        </ul>
    </section>
  )
}
