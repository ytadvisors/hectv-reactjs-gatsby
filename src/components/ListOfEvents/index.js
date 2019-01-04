import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { StaticQuery, graphql, Link } from 'gatsby';
import { getCurrentEvents } from '../../utils/helperFunctions';

import './styles.scss';

export default () => (
  <StaticQuery
    query={graphql`
      query defaultEventListQuery {
        allWordpressWpEvent(sort: { fields: [acf___eventDates], order: ASC }) {
          edges {
            node {
              slug
              title
              link
              acf {
                eventDates {
                  startTime
                  endTime
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      const currentDay = moment(moment(new Date()).format('MM/DD/YYYY'));
      const events = getCurrentEvents(
        currentDay,
        data.allWordpressWpEvent.edges,
        5
      );

      const posts = [];
      if (events && events.values)
        _.keys(events.values).forEach(key =>
          posts.push(events.values[key].node)
        );

      return (
        <section className="list-of-events">
          <div className="title">
            <div>
              <h4>Things to do in St. Louis</h4>
            </div>
          </div>
          <ul className="event-list">
            {posts.map((event, x) => {
              const { title, link } = event;
              return (
                link && (
                  <li key={link}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${x + 1}. ${title}. `
                      }}
                    />
                    <Link to={link.replace(/https?:\/\/[^/]+/, '')}>
                      {' '}
                      Read More
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </section>
      );
    }}
  />
);
