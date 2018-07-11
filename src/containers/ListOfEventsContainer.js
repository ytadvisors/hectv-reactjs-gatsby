import React from 'react';
import { graphql } from "gatsby"
import ListOfEvents from "./../components/ListOfEvents";

export default ({data, props}) => {
  return <ListOfEvents {...props} data={...data} />
}

export const query = graphql`
   query scheduleQuery ($slug: String!) {
     allWordpressWpEvent{
      edges{
        node{
          slug
          title
          link
          acf{
            venue
            event_price
            web_address
            event_dates {
              start_time
              end_time
            }
          }
        }
      }
    }
   }
`;