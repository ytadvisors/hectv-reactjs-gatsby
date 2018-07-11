import React from "react";
import { graphql } from "gatsby"
import Helmet from 'react-helmet';
import Layout from "./../components/Layout"

export default ({data, props}) => {
  return <div>
    <Helmet
      title={data.wordpressPost.title}
      meta={[
        {name: 'description', content: 'Sample'},
        {name: 'keywords', content: 'sample, something'},
      ]}
    />
    <Layout {...props}>
      <section>
        {data.wordpressPost.content}
      </section>
    </Layout>
  </div>
}

export const query = graphql`
   query postQuery ($id: String!){
     wordpressPost (id : { eq : $id }) {
        title
        content
      }
   }
`;