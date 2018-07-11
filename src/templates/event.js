import React from "react";
import { graphql } from "gatsby"
import Helmet from 'react-helmet';
import Layout from "./../components/Layout"

export default ({data, props}) => {
  return <div>
    <Helmet
      title={data.wordpressWpEvent.title}
      meta={[
        {name: 'description', content: 'Sample'},
        {name: 'keywords', content: 'sample, something'},
      ]}
    />
    <Layout {...props}>
      <section>
        {data.wordpressWpEvent.content}
      </section>
    </Layout>
  </div>
}

export const query = graphql`
   query eventQuery ($id: String!) {
     wordpressWpEvent (id : { eq : $id }) {
        title
        content
      }
   }
`;
