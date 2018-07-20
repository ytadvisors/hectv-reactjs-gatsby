import React from "react";
import {graphql} from "gatsby"

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import EventNav from './../components/SubNavigation/EventNav';
import ListOfPosts from "./../components/ListOfPosts";

export default ({data}) => {
  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let posts = data.wpEvents && data.wpEvents.edges.map(obj => obj.node);
  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title: `HEC-TV | ${data.wpPage.title}`,
        image: "",
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url: process.env.SITE_HOST,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name: "hectv.org",
        author: "hectv",
        twitter_handle: "@hec_tv"
      }}
    />
    <Layout slug={data.wpPage.slug}>
      <div>
        <div className="col-md-12">
          <EventNav />
        </div>
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          design={data.wpPage.acf}
          loadMore={null}
          resize_rows
        />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query eventPageQuery {
  wpPage: wordpressPage(slug: {eq: "events"}) {
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
  
 wpEvents: allWordpressWpEvent(limit: 10) {
    edges {
      node {
        link
        title
        slug
        wordpress_id
        link
        thumbnail
        acf {
          event_dates{
            start_time
            end_time
          }
        }
      }
    }
  }
}`;