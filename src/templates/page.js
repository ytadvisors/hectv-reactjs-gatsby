import React from "react";
import { graphql } from "gatsby"

import { removeDuplicates, getPosts } from "./../utils/helperFunctions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout";
import ListOfPosts from "./../components/ListOfPosts";

export default  (props) => {
  const {
    data,
    pageContext: { live_videos}
  } = props;

  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";

  let posts = getPosts(data, "wpPage", "post_list", "post", "wpPosts");
  posts = removeDuplicates(posts, "wordpress_id");
  let image = "";
  if(posts.length > 0 && posts[0].acf){
    let imgContainer = posts[0].acf.video_image || posts[0].acf.post_header;
    image = imgContainer && imgContainer.sizes  ? imgContainer.sizes.medium : "";
  }

  return <div>
    <SEO
      {...{
        title : `HEC-TV | ${data.wpPage.title}`,
        image : image,
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hecmedia.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout
      slug={data.wpPage.slug}
      live_videos={live_videos}
    >
      <ListOfPosts
        posts={posts || []}
        link={{ page: 'posts' }}
        num_results={0}
        design={data.wpPage.acf}
        loadMore={null}
        resize_rows
      />
    </Layout>
  </div>
};

export const query = graphql`
query sitePageQuery ($slug: String!){
  wpSite: site {
    siteMetadata{
      siteUrl
    }
  }
 wpPage: wordpressPage (slug : { eq : $slug }) {
   title
   content
   link
   slug
   acf{
     default_row_layout
     default_display_type
     new_row_layout {
       row_layout
       display_type
     }
     post_list{
      post{
        post_title
        post_name
        post_excerpt
        wordpress_id
        acf{
          is_video
          video_image{
            sizes{
              medium
              medium_large
            }
          }
          post_header{
            sizes{
              medium
              medium_large
            }
          }
        }
      }
    }
   }
 }
 wpPosts: allWordpressPost (
  filter: {
    categories : 
      { 
          slug :
            { eq: $slug }
      }
  }
){
    edges{
      node{
        link
        title
        excerpt
        slug
        wordpress_id
        categories{
          link
          name
        }
        thumbnail
        acf{
          is_video
        }
      }
    }
  }
}
`;