import React from "react";
import {graphql} from "gatsby"

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import EventNav from './../components/SubNavigation/EventNav';
import Template1 from "../components/Templates/template-1/index";
import Template3 from "../components/Templates/template-3/index";
import ListOfPosts from "./../components/ListOfPosts";

export default ({data}) => {
  let title = data.wpPage.title;

  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  let content = <SinglePost {...{post: data.wpPage}} />;
  switch(data.wpPage.template){
    case "template-1.php":
      content = <Template1 {...{page_content: data.wpPage.acf}} />;
      break;
    case "template-2.php":
      content = <div className="col-md-12">
        <SinglePost {...{post: data.wpPage}} />
      </div>;
      break;
    case "template-3.php":
      content = <Template3 {...{page_content: data.wpPage.acf}} />;
      break;
    default:
      if(data.wpPage.slug === "events"){
        let posts = data.wpEvents && data.wpEvents.edges.map(obj => obj.node);
        content = <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          design={data.wpPage.acf}
          loadMore={null}
          resize_rows
        />;
      }
  }
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
          { data.wpPage.template !== "template-2.php"
            ? data.wpPage.slug === "events"
              ? <EventNav />
              : <DefaultNav title={title} link={data.wpPage.link}/>
            : ""
          }
        </div>
        <div> {content} </div>
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query magazinePageQuery($slug: String!) {
  wpPage: wordpressPage(slug: {eq: $slug}) {
    slug
    title
    content
    link
    template
    acf {
      address
      phone_number
      fax_number
      directions
      opportunities
      tv_providers {
        provider
        channel
      }
      partner_logos {
        partner_logo {
          title
          filename
        }
        partner_link
      }
      higher_education_partners {
        partner
      }
      team {
        name
        position
        email
      }
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