import React from "react";
import { graphql } from "gatsby"
import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

export default ({data}) => {

  return <div>
    <SEO
      {...{
        title : data.wpPost.title,
        image : data.wpPost.thumbnail,
        description : data.wpPost.content.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpPost.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
      />
    <Layout style={{ background: '#eee' }}>
      <div className="col-md-12" style={{ background: '#eee' }}>
        <SinglePost {...{ post : data.wpPost}} />
      </div>
    </Layout>
  </div>
}

export const query = graphql`
   query postQuery ($id: String!){
     wpPost: wordpressPost (id : { eq : $id }) {
        title
        content
        thumbnail
        link
        acf {
          youtube_id
          vimeo_id
        }
      }
   }
`;