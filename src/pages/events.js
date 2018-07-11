import React from "react";
import { graphql } from "gatsby"
import Helmet from 'react-helmet';
import Layout from "./../components/Layout"

export default ({data, props}) => {
  return <div>
    <Helmet
      title="Events"
      meta={[
        {name: 'description', content: 'Sample'},
        {name: 'keywords', content: 'sample, something'},
      ]}
    />
    <Layout {...props}>
      <section>
        {data.allWordpressWpEvent.edges}
      </section>
    </Layout>
  </div>
}

export const query = graphql`
   query eventsPageQuery {
     allWordpressWpEvent {
        edges {
          node {
            id
            slug
            title
          }
        }
      }
   }
`;