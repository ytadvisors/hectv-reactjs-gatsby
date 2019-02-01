import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import DefaultNav from '../components/SubNavigation/DefaultNav';

export default ({
  data: {
    wpPage: { title, content, link = '', slug } = {},
    wpSite: {
      siteMetadata: { siteUrl, fbAppId, googleOauth2ClientId } = {}
    } = {},
    wpSchedule,
    wpMenu
  }
}) => {
  const programs = getPrograms(wpSchedule.edges, 5);
  const post = { title, content, link, slug, acf: { content } };

  const description =
    content || 'On Demand Arts, Culture & Education Programming';

  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | ${title}`,
          image: '',
          description: getExcerpt(description, 320),
          url: siteUrl,
          fbAppId,
          pathname: link.replace(/https?:\/\/[^/]+/, ''),
          siteName: 'hecmedia.org',
          author: 'hectv',
          twitterHandle: '@hec_tv'
        }}
      />
      <Layout
        slug={slug}
        menus={wpMenu.edges}
        programs={programs}
        fbAppId={fbAppId}
        googleOauth2ClientId={googleOauth2ClientId}
      >
        <div className="col-md-12">
          <DefaultNav title={title} link={link} />
        </div>
        <div className="col-md-12">
          <SinglePost {...{ post }} hideTitle />
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query template2PageQuery($slug: String!) {
    wpSite: site {
      siteMetadata {
        siteUrl
        fbAppId
        googleOauth2ClientId
      }
    }
    wpMenu: allWordpressWpApiMenusMenusItems {
      edges {
        node {
          name
          count
          items {
            title
            url
            wordpress_children {
              wordpress_id
              wordpress_parent
              title
              url
            }
          }
        }
      }
    }
    wpSchedule: allWordpressWpSchedules {
      edges {
        node {
          slug
          title
          link
          acf {
            schedulePrograms {
              programStartTime
              programEndTime
              programTitle
              programStartDate
            }
          }
        }
      }
    }
    wpPage: wordpressPage(slug: { eq: $slug }) {
      slug
      title
      content
      link
      template
    }
  }
`;
