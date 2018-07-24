import React from 'react';
import moment from 'moment';
import { StaticQuery, graphql, Link } from "gatsby"

import './modules.scss';

export const getCurrentEvents = (current_day, events, num_entries) => {
  return events.reduce(
    (result, item) => {
      const {
        node : {
          acf : {
            event_dates
          }
        }
      } = item;

      if (!num_entries || result['started'] < num_entries) {
        for(let x = 0; x < event_dates.length; x++){
          const {
            start_time,
            end_time
          } = event_dates[x];
          let formated_start_time = moment(start_time, "MM/DD/YYYY h:mm a", true);
          let formated_end_time = moment(end_time, "MM/DD/YYYY h:mm a", true);

          //Add date prop
          if(!item.node.date || x === 0)
            item.node.date = ``;
          if(formated_start_time.isValid() && formated_end_time.isValid()) {
            let format = "MMM DD";
            if(formated_end_time.get("month") < formated_start_time.get("month"))
              format = "MMM DD, YYYY";
            item.node.date += `${formated_start_time.format(format)} - ${formated_end_time.format(format)} <br />`;
          }

          if (current_day.isSameOrBefore(formated_end_time)
            && (!num_entries || result['started'] < num_entries ) && current_day.isSameOrAfter(formated_start_time)) {
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

        const current_day = moment(moment().format('MM/DD/YYYY'));
        const events = getCurrentEvents(current_day, data.allWordpressWpEvent.edges, 5);
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
