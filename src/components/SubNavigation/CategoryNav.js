import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import './styles.scss';

export default ({ slug }) => (
  <StaticQuery
    query={graphql`
      query subcategoryQuery {
        allWordpressCategory {
          edges {
            node {
              name
              slug
              wordpress_id
              wordpress_parent
              link
            }
          }
        }
      }
    `}
    render={data => {
      const menus = data.allWordpressCategory.edges;
      const category = menus.reduce(
        (result, menu) => (menu.node.slug === slug ? menu.node : result)
      );
      const parentId = category.wordpress_parent || category.wordpress_id;
      const parentCategory = menus.reduce(
        (result, menu) =>
          menu.node.wordpress_id === parentId ? menu.node : result
      );
      const subcategories = menus.filter(
        menu => menu.node.wordpress_parent === parentId
      );
      return (
        <section className="sub-navigation">
          <div className="row heading">
            <div className="col-md-12">
              <div className="pull-left">
                {parentCategory.link && (
                  <h2>
                    <Link
                      to={parentCategory.link.replace(/https?:\/\/[^/]+/, '')}
                      dangerouslySetInnerHTML={{
                        __html: parentCategory.name
                      }}
                    />
                  </h2>
                )}
              </div>
            </div>
          </div>
          <ul className="link-list">
            {subcategories.map(subcategory => (
              <li key={subcategory.node.link}>
                <Link
                  to={subcategory.node.link.replace(/https?:\/\/[^/]+/, '')}
                >
                  {subcategory.node.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      );
    }}
  />
);
