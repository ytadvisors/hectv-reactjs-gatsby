import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { StaticQuery, graphql } from "gatsby"

import './modules.scss';

const current_day = moment();

const getCurrentEvents = (events, num_entries) => {
  return events.reduce(
    (result, item) => {
      const {
        node : {
          acf : {
            event_dates
          }
        }
      } = item;

      if (result['started'] < num_entries) {
        for(let x = 0; x < event_dates.length; x++){
          const {
            start_time,
            end_time
          } = event_dates[x];
          let formated_start_time = moment(start_time, "MM/DD/YYYY h:mm a");
          let formated_end_time = moment(end_time, "MM/DD/YYYY h:mm a");

          if (current_day.isSameOrBefore(formated_end_time)
            && result['started'] < num_entries && current_day.isSameOrAfter(formated_start_time)) {
            result['values'].push(item);
            result['started']++;
          }

        }
      }
      return result;
    },
    { values: [], started: 0 }
  );
};

export default () => {
  return <StaticQuery
    query={graphql`
     query defaultEventListQuery {
       allWordpressWpEvent (
          sort :{
            fields: [acf___event_dates]
            order:ASC
          }
        ){
        edges{
          node{
            slug
            title
            link
            acf{
              event_dates{
                start_time
                end_time
              }
            }
          }
        }
      }
     }`}
    render={
      data => {
        const events = getCurrentEvents(data.allWordpressWpEvent.edges, 5);
        return <section className="list-of-events">
          <div className="title">
            <div>
              <h4>Things to do in St. Louis</h4>
            </div>
          </div>
          <ul className="event-list">
            {events && events.values && events.values.map((event, x) => {
              const {
                node : {
                  title,
                  link
                } ={}
              } = event;
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
      }
    }
  />
}
