import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

const Profile = ({ data }) => {
  const {
    wpSchedule,
    wpSite: {
      siteMetadata: { siteUrl = '', fbAppId = '', googleOauth2ClientId } = {}
    } = {},
    wpMenu
  } = data;
  const programs = getPrograms(wpSchedule.edges, 5);

  const description = 'On Demand Arts, Culture & Education Programming';

  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | Profile`,
          image: '',
          description: getExcerpt(description, 320),
          url: siteUrl,
          fbAppId,
          pathname: `${siteUrl}/search`,
          siteName: 'hecmedia.org',
          author: 'hectv',
          twitterHandle: '@hec_tv'
        }}
      />
      <Layout
        programs={programs}
        menus={wpMenu.edges}
        fbAppId={fbAppId}
        googleOauth2ClientId={googleOauth2ClientId}
      >
        <h2>Profile</h2>
      </Layout>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  posts: state.postReducers.posts
});

export default connect(mapStateToProps)(Profile);

export const query = graphql`
  query profilePageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        apiUrl
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
  }
`;
