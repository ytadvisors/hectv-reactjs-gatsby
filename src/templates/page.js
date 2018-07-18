import React from "react";
import { graphql } from "gatsby"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import EventNav from './../components/SubNavigation/EventNav';
import Template1 from "../components/Templates/template-1/index";
import Template3 from "../components/Templates/template-3/index";

import "./../utils/cssDependencies";

export default ({data}) => {
  let title = data.wpPage.title;

  if(data.wpPage.acf)
    data.wpPage.acf.content = data.wpPage.content;

  let description = data.wpPage.content || "On Demand Arts, Culture &amp; Education Programming";

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
    <Layout >
      <div>
        <div className="col-md-12">
          { data.wpPage.template !== "template-2.php"
            ? data.wpPage.slug === "events"
              ? <EventNav />
              : <DefaultNav title={title} link={data.wpPage.link} />
            : ""
          }
        </div>
        <div>
          { data.wpPage.template === "template-2.php" && <div className="col-md-12">
            <SinglePost {...{ post: data.wpPage}} /></div> }
          { data.wpPage.template === "template-1.php" && <Template1 {...{ page_content: data.wpPage.acf}} /> }
          { data.wpPage.template === "template-3.php" && <Template3 {...{ page_content: data.wpPage.acf}} /> }
        </div>
      </div>
    </Layout>
  </div>
}

export const query = graphql`
   query defaultPageQuery ($slug: String!){
     wpPage: wordpressPage (slug : { eq : $slug }) {
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
        public_school_partners
        higher_education_partners {
          partner
        }
        team {
          photo
          name
          position
          email
        }
        video_id
      }
     }
   }
`;