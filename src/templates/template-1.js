import React from "react";
import {graphql} from "gatsby"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import Template1 from "../components/Templates/template-1/index";

export default  (props) => {
  const {
    data,
    pageContext: { live_videos}
  } = props;

  let title = data.wpPage.title;

  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title: `HEC-TV | ${data.wpPage.title}`,
        image: "",
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        fb_app_id: data.wpSite.siteMetadata.fbAppId,
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
          <DefaultNav title={title} link={data.wpPage.link}/>
        </div>
        <Template1 {...{page_content: data.wpPage.acf}} />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query template1PageQuery($slug: String!) {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpPage: wordpressPage(slug: {eq: $slug}) {
    slug
    title
    content
    link
    template
    acf {
      video_id
      address
      phone_number
      fax_number
      directions
      opportunities
      tv_providers {
        provider
        channel
      }
      team {
        name
        position
        email
      }
    }
  }
  
}`;