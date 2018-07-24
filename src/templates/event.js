import React from "react";
import { graphql } from "gatsby"
import { getPosts } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import ListOfPosts from "./../components/ListOfPosts";
import _ from "lodash"

export default ({data}) => {

  let description = data.wpEvent.content || "On Demand Arts, Culture & Education Programming";
  let posts = getPosts(data, "wpEvent", "event_posts", "event_post");
  posts = _.take(posts, 3);

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
        <ListOfPosts
          title="Related Posts"
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          style={{
            background: '#f9f9f9',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}
          design={{
            default_row_layout: '3 Columns',
            default_display_type: 'Post'
          }}
          loadMore={null}
          resize_rows
        />
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
      event_posts{
        event_post{
          post_title
          post_excerpt
          post_name
          acf {
            is_video
            video_image{
              sizes{
                medium
                medium_large
              }
            }
            post_header {
              sizes {
                medium
                medium_large
              }
            }
          }
        }
      }
    }
  }
}
`;