import React from "react";
import {graphql} from "gatsby"

import Map from '../components/Map';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import Template3 from "../components/Templates/template-3/index";


function callbackFunc(){
  console.log("Done");
}

export default (props) => {

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
        <Template3 {...{page_content: data.wpPage.acf}} callbackFunc={callbackFunc} >
          <Map mapKey={data.wpSite.siteMetadata.mapKey} />
        </Template3>
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query template3PageQuery($slug: String!) {
  wpSite: site {
    siteMetadata{
      siteUrl
      mapKey
    }
  }
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
      team {
        name
        position
        email
      }
    }
  }
  
}`;