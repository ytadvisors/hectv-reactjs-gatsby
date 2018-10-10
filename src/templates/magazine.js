import React from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';
import { getPosts } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost";
import ListOfPosts from "./../components/ListOfPosts";

export default  (props) => {
  const {
    data,
    pageContext: { live_videos}
  } = props;

  data.wpMagazine.thumbnail = "";
  if(data.wpMagazine.acf && data.wpMagazine.acf.cover_image)
    data.wpMagazine.thumbnail = data.wpMagazine.acf.cover_image;

  let description = data.wpMagazine.content || "On Demand Arts, Culture & Education Programming";
  let posts = getPosts(data, "wpMagazine", "magazine_post", "post");

  return <div>
    <SEO
      {...{
        title : data.wpMagazine.title,
        image : data.wpMagazine.thumbnail,
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        fb_app_id: data.wpSite.siteMetadata.fbAppId,
        pathname: data.wpMagazine.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hecmedia.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout
      style={{ background: '#eee' }}
      slug={data.wpMagazine.slug}
      live_videos={live_videos}
    >
      <div className="col-md-12" style={{ background: '#eee' }}>
        <SinglePost {...
          { post : data.wpMagazine,
            classes : {
              thumbnail: 'col-md-2 pull-right',
              content: 'col-md-10 no-padding'
            }
          }
        } />
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          design={{
            default_row_layout: '2 Columns',
            default_display_type: 'Post'
          }}
          loadMore={null}
          style={{
            background: '#f9f9f9',
            border: '1px solid #ddd'
          }}
          resize_rows
        />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query magazineQuery ($id: String!){
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
 wpMagazine : wordpressWpMagazine (id : { eq : $id }) {
    title
    content
    link
    slug
    acf{
      cover_image
      magazine_post{
        post {
          post_title
          post_excerpt
          post_name
          acf{
            is_video
            post_header {
              sizes{
                medium
                medium_large
              }
            }
            video_image {
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