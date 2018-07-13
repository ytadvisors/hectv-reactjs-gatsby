import React from "react";
import { graphql } from "gatsby"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

export default ({data}) => {

  return <div>
    <SEO
      {...{
        title : data.wpEvent.title,
        image : data.wpEvent.thumbnail,
        description : data.wpEvent.content.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpEvent.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout >
      <div className="col-md-12" >
        <SinglePost {...{ post : data.wpEvent}} />
      </div>
    </Layout>
  </div>
}

export const query = graphql`
   query eventQuery ($id: String!){
     wpEvent: wordpressWpEvent (id : { eq : $id }) {
        title
        content
        link
        thumbnail
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