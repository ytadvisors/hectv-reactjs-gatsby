import React from "react";
import { graphql } from "gatsby"
import Helmet from 'react-helmet';
import "./../utils/cssDependencies";

import Layout from "./../components/Layout"

export default ({data, props}) => {
  return <div>
    <Helmet
      title={data.wpPage.title}
      meta={[
        {name: 'description', content: 'Sample'},
        {name: 'keywords', content: 'sample, something'},
      ]}
    />
    <Layout {...props}>
      <section>
        {data.wpPage.content}
      </section>
    </Layout>
  </div>
}

export const query = graphql`
   query homePageQuery {
     wpPage: wordpressPage (slug : { eq : "home" }) {
       title
       content
     }
   }
`;