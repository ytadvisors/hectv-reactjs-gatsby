import React from "react";
import {graphql} from "gatsby"

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import Template3 from "../components/Templates/template-3/index";


function callbackFunc(){
  console.log("Done");
}

export default ({data}) => {
  let title = data.wpPage.title;

  if (data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title: `HEC-TV | ${data.wpPage.title}`,
        image: "",
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name: "hectv.org",
        author: "hectv",
        twitter_handle: "@hec_tv"
      }}
    />
    <Layout slug={data.wpPage.slug}>
      <div>
        <div className="col-md-12">
          <DefaultNav title={title} link={data.wpPage.link}/>
        </div>
        <Template3 {...{page_content: data.wpPage.acf}} callbackFunc={callbackFunc} />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query template3PageQuery($slug: String!) {
  wpSite: site {
    siteMetadata{
      siteUrl
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
    }
  }
  
}`;