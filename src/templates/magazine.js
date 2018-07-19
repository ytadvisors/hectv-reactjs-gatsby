import React from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

import "./../utils/cssDependencies";

export default ({data}) => {

  data.wpMagazine.thumbnail = "";
  if(data.wpMagazine.acf && data.wpMagazine.acf.cover_image)
    data.wpMagazine.thumbnail = data.wpMagazine.acf.cover_image;

  let description = data.wpMagazine.content || "On Demand Arts, Culture & Education Programming";

  return <div>
    <SEO
      {...{
        title : data.wpMagazine.title,
        image : data.wpMagazine.thumbnail,
        description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
        url : process.env.SITE_HOST,
        pathname: data.wpMagazine.link.replace(/https?:\/\/[^/]+/, ''),
        site_name : "hectv.org",
        author: "hectv",
        twitter_handle : "@hec_tv"
      }}
    />
    <Layout style={{ background: '#eee' }} slug={data.wpMagazine.slug}>
      <div className="col-md-12" style={{ background: '#eee' }}>
        <SinglePost {...
          { post : data.wpMagazine,
            classes : {
              thumbnail: 'col-md-2 pull-right',
              content: 'col-md-10 no-padding'
            }
          }
                    } />
      </div>
    </Layout>
  </div>
};

export const query = graphql`
     query magazineQuery ($id: String!){
       wpMagazine : wordpressWpMagazine (id : { eq : $id }) {
          title
          content
          link
          slug
      		acf{
            cover_image
          }
        }
     }
`;