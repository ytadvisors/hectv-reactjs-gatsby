import React from 'react';
import { Link, StaticQuery, graphql  } from 'gatsby';
import './styles.scss';

export default (props) => {
  const { slug } = props;
  return (
      <StaticQuery
        query={graphql`
           query subcategoriesQuery {
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
        render={
          data => {
            const menus = data.allWordpressCategory.edges;
            const category  = menus.reduce((result, menu) => menu.node.slug === slug ? menu.node : result);
            const parent_id = category.wordpress_parent || category.wordpress_id;
            const parent_category = menus.reduce((result, menu) =>  menu.node.wordpress_id === parent_id ? menu.node : result );
            const subcategories = menus.filter(menu => menu.node.wordpress_parent === parent_id);
            return <section className="sub-navigation">
              <div className="row heading">
                <div className="pull-left">
                  <h2>
                    <Link to ={parent_category.link.replace(/https?:\/\/[^/]+/, '')}
                          dangerouslySetInnerHTML={{ __html: parent_category.name }}
                    />
                  </h2>
                </div>
              </div>
              <ul className="link-list">
                {subcategories.map((subcategory, x) => (
                  <li key={`link-${x}`}>
                    <Link to={subcategory.node.link.replace(/https?:\/\/[^/]+/, '')}>{subcategory.node.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          }
        }
      />
  );
}

