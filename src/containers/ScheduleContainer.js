import React from 'react';
import { graphql } from "gatsby"
import Schedule from "./../components/Schedule";

export default ({data, props}) => {
  return <Schedule data={...data} {...props} />
}

export const query = graphql`
   query scheduleQuery ($slug: String!) {
     wordpressWpSchedules(slug: { eq:$slug } ){
      slug
      title
      link
      acf{
        schedule_programs{
          program_start_time
          program_end_time
          program_title
          program_start_date
        }
      }
    }
   }
`;