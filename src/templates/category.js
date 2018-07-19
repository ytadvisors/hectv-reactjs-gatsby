import React from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import CategoryNav from './../components/SubNavigation/CategoryNav';

import "./../utils/cssDependencies";

export default ({data}) => {
  data.wpCategory.content = "";
  if(data.wpCategory.description)
    data.wpCategory.content = data.wpCategory.description;

  let description = data.wpCategory.content || "On Demand Arts, Culture & Education Programming";

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
      </section>
    </Layout>
  </div>
};

export const query = graphql`
   query categoryQuery ($slug: String!){
     wpCategory: wordpressCategory (slug : { eq : $slug }){
      slug
      link
      name
      description
    }
   }
`;