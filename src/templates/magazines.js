import React from "react";
import {graphql} from "gatsby"

import { getFirstImageFromWpList } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

export default  (props) => {
  const {
    data,
    pageContext: { live_videos}
  } = props;

  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let posts = data.wpMagazine && data.wpMagazine.edges.map(obj => obj.node);
  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title: `HEC-TV | ${data.wpPage.title}`,
        image: getFirstImageFromWpList(posts),
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name: "hecmedia.org",
        author: "hectv",
        twitter_handle: "@hec_tv"
      }}
    />
    <Layout
      slug={data.wpPage.slug}
      live_videos={live_videos}
    >
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