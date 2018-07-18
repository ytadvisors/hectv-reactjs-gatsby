import React from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"

const Pages =  ({data, props}) => {
  let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
  return <div>
    <SEO
      {...{
        title : `HEC-TV | ${data.wpPage.title}`,
        image : "",
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout {...props}>
      <section>
        {data.wpPage.content}
      </section>
    </Layout>
  </div>
};

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(Pages);

export const query = graphql`
   query homePageQuery {
     wpPage: wordpressPage (slug : { eq : "home" }) {
       title
       content
       link
     }
   }
`;