import React from 'react';
import { Link, StaticQuery, graphql  } from 'gatsby';
import './styles.scss';

export default (props) => {
  const { title, link } = props;
  return (
      <section className="sub-navigation">
        <div className="row heading">
          <div className="pull-left">
            <h2>
              <Link to ={link.replace(/https?:\/\/[^/]+/, '')}
                    dangerouslySetInnerHTML={{ __html: title }}
              />
            </h2>
          </div>
        </div>
      </section>
  );
}

