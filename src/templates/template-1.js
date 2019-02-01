import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import Template1 from '../components/Templates/template-1/index';

export default ({
  data: {
    wpPage: { title, content, acf = {}, link = '', slug } = {},
    wpSite: {
      siteMetadata: { siteUrl, fbAppId, googleOauth2ClientId } = {}
    } = {},
    wpSchedule,
    wpMenu
  }
}) => {
  const programs = getPrograms(wpSchedule.edges, 5);
  const pageContent = { ...acf };
  pageContent.content = content;

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
        <Template1 {...{ pageContent }} />
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query template1PageQuery($slug: String!) {
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
      acf {
        videoId
        address
        phoneNumber
        faxNumber
        directions
        opportunities
        tvProviders {
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
  }
`;
