import React from "react";
import { graphql } from "gatsby"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

export default ({data}) => {

  let description = data.wpEvent.content || "On Demand Arts, Culture & Education Programming";

  return <div>
    <SEO
      {...{
        title : data.wpEvent.title,
        image : data.wpEvent.thumbnail,
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        pathname: data.wpEvent.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout  slug={data.wpEvent.slug}>
      <div className="col-md-12" >
        <SinglePost {...{ post : data.wpEvent}} />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query eventQuery ($id: String!){
  wpSite: site {
    siteMetadata{
      siteUrl
    }
  }
 wpEvent: wordpressWpEvent (id : { eq : $id }) {
    title
    content
    link
    thumbnail
    slug
    acf {
      venue
      web_address
      event_price
      event_dates{
        start_time
        end_time
      }
    }
  }
}
`;