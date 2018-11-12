import React from 'react';
import { Link } from 'gatsby';
import './styles.scss';

export default ({ title, link }) => (
  <section className="sub-navigation">
    <div className="row heading">
      <div className="pull-left">
        <h2>
          <Link to={link.replace(/https?:\/\/[^/]+/, '')}>
            <div dangerouslySetInnerHTML={{ __html: title }} />
          </Link>
        </h2>
      </div>
    </div>
  </section>
);
