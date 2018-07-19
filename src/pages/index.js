import React from "react";
import { graphql } from "gatsby"

import "./../utils/cssDependencies";

import { removeDuplicates } from "./../utils/helperFunctions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout";
import ListOfPosts from "./../components/ListOfPosts";

export default ({data, props}) => {
  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  let featured_posts = data.wpPage.acf
    && data.wpPage.acf.post_list
    && data.wpPage.acf.post_list.map(obj =>  (
      { ...obj.post,
        ...{ title: obj.post.post_title},
        ...{ excerpt: obj.post.post_excerpt }
      }));
  let posts = [...featured_posts, ...data.wpPosts.edges.map(obj => obj.node)];
  posts = removeDuplicates(posts, "wordpress_id");
  let image = posts[0].acf.video_image.sizes.medium;

  return <div>
    <SEO
      {...{
        title : `HEC-TV | ${data.wpPage.title}`,
        image : image,
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout showBottomNav slug={data.wpPage.slug}>
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
   query homePageQuery {
     wpPage: wordpressPage (slug : { eq : "home" }) {
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
     wpPosts: allWordpressPost (limit:10){
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