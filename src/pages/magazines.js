import React from "react";
import {graphql} from "gatsby"

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

export default ({data}) => {
  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let posts = data.wpMagazine && data.wpMagazine.edges.map(obj => obj.node);
  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title: `HEC-TV | ${data.wpPage.title}`,
        image: "",
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url: data.wpSite.siteUrl,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name: "hectv.org",
        author: "hectv",
        twitter_handle: "@hec_tv"
      }}
    />
    <Layout slug={data.wpPage.slug}>
      <div>
        <div className="col-md-12">
          <DefaultNav title="Magazines" link="/magazines"/>
        </div>
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'magazine' }}
          num_results={0}
          design={data.wpPage.acf}
          loadMore={null}
        />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query magazinePageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
    }
  }
  wpPage: wordpressPage(slug: {eq: "magazines"}) {
    slug
    title
    content
    link
    acf {
      video_id
      default_row_layout
      default_display_type
      new_row_layout {
        row_layout
        display_type
      }
    }
  }
  
 wpMagazine: allWordpressWpMagazine{
    edges {
      node {
        link
        title
        slug
        wordpress_id
        link
        acf {
          cover_image
        }
      }
    }
  }
}`;