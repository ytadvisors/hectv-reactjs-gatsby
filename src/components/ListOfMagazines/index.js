import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import LazyLoad from 'react-lazyload';

import './styles.scss';

export default () => (
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
            allWordpressWpMagazine(limit: 5) {
              edges {
                node {
                  title
                  link
                  acf {
                    coverImage
                  }
                }
              }
            }
          }
        `}
        render={data => {
          const magazines = data.allWordpressWpMagazine.edges;
          return magazines.map(
            ({
              node: {
                title,
                link,
                acf: { coverImage }
              }
            }) => (
              <li key={link}>
                <Link to={link.replace(/https?:\/\/[^/]+/, '')}>
                  <div className="row">
                    <div className="magazine-img col-xs-4 ">
                      <LazyLoad height={150}>
                        <img
                          src={coverImage.replace(/^https?:\/\//, 'https://')}
                          className="img-responsive"
                          alt="cover"
                        />
                      </LazyLoad>
                    </div>
                    <div
                      className="magazine-info col-xs-8"
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                  </div>
                </Link>
              </li>
            )
          );
        }}
      />
    </ul>
  </section>
);
