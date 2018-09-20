import React from "react";
import {graphql} from "gatsby"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import DefaultNav from './../components/SubNavigation/DefaultNav';

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
        title: `HEC-TV | ${title}`,
        image: "",
        description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url: data.wpSite.siteMetadata.siteUrl,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name: "hectv.org",
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
        <div className="col-md-12">
          <SinglePost {...{post: data.wpPage}} hideTitle />
        </div>
      </div>
    </Layout>
  </div>
};

export const query = graphql`
query template2PageQuery($slug: String!) {
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
  }
}`;