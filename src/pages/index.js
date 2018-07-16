import React from "react";
import { graphql } from "gatsby"
import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"

export default ({data, props}) => {
  return <div>
    <SEO
      {...{
        title : `HEC-TV | ${data.wpPage.title}`,
        image : "",
        description : data.wpPage.content.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
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
       link
     }
   }
`;