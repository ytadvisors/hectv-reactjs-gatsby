import React from "react";
import { graphql } from "gatsby"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import CategoryNav from './../components/SubNavigation/CategoryNav';
import ListOfPosts from "./../components/ListOfPosts";

import "./../utils/cssDependencies";

export default ({data}) => {
  data.wpCategory.content = "";
  if(data.wpCategory.description)
    data.wpCategory.content = data.wpCategory.description;

  let description = data.wpCategory.content || "On Demand Arts, Culture & Education Programming";

  let posts = data.wpCategoryPosts.edges.map(obj => obj.node);
  return <div>
    <SEO
      {...{
        title : `HEC-TV | ${data.wpCategory.name}`,
        image : "",
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpCategory.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout >
      <section>
        <CategoryNav slug={data.wpCategory.slug} />
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          design={null}
          loadMore={null}
          resize_rows
        />
      </section>
    </Layout>
  </div>
};

export const query = graphql`
 query categoryQuery ($slug: String!){
    wpCategory: wordpressCategory (
      slug : { eq : $slug }
    ){
      slug
      link
      name
      description
    }
    wpCategoryPosts: allWordpressPost(
      filter: {
        categories : 
          { 
              slug :
                { eq: $slug }
          }
      }
    ) {
      edges{
        node {
          slug
          link
          title
          excerpt
          thumbnail
          categories {
            name
            link
            slug
          }
          acf{
            is_video
          }
        }
      }
    }
  }
`;