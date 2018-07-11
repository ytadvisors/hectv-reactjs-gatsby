import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'react-bootstrap';

import './styles.scss';

export default class ListOfEvents extends Component {
  constructor(data, props) {
    super(props);
  }

  render() {
    const { title, event_list} = this.props;
    return (
      <section className="list-of-events">
        <div className="title">
          <div>
            <h4>Things to do in St. Louis</h4>
          </div>
        </div>
        <ul className="event-list">
          {event_list.map((event, x) => {
            const { title, slug } = event;
            return (
              <li key={`event-${x}`}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${x + 1}. ${title}. `
                  }}
                />
                <Link to={`events/${slug}`}> Read More</Link>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
}
