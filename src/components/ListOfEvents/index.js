import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'react-bootstrap';

import './modules.scss';

export default (props) => {
  let data = props.allWordpressWpEvent || {};
  const { edges } = data;
  return (
    <section className="list-of-events">
      <div className="title">
        <div>
          <h4>Things to do in St. Louis</h4>
        </div>
      </div>
      <ul className="event-list">
        {edges && edges.map((event, x) => {
          const { node : { title, link }} = event;
          return (
            <li key={`event-${x}`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: `${x + 1}. ${title}. `
                }}
              />
              <Link to={link.replace(/https?:\/\/[^/]+/, '')}> Read More</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
