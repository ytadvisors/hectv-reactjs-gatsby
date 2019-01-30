import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import {
  getFirstImageFromWpList,
  getPrograms,
  getExcerpt
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import ListOfPosts from '../components/ListOfPosts';

export default ({ data }) => {
  const {
    wpSchedule: { edges } = {},
    wpMenu,
    wpSite: {
      siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
    } = {},
    wpMagazine,
    wpPage
  } = data;
  const programs = getPrograms(edges, 5);
  const pageInfo = { ...wpPage };

  if (pageInfo) pageInfo.content = wpPage.content;

  const posts = wpMagazine && wpMagazine.edges.map(obj => obj.node);
  const description =
    wpPage.content || 'On Demand Arts, Culture & Education Programming';
  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | ${wpPage.title}`,
          image: getFirstImageFromWpList(posts),
          description: getExcerpt(description, 320),
          url: siteUrl,
          fbAppId,
          pathname: wpPage.link.replace(/https?:\/\/[^/]+/, ''),
          siteName: 'hecmedia.org',
          author: 'hectv',
          twitterHandle: '@hec_tv'
        }}
      />
      <Layout
        slug={wpPage.slug}
        menus={wpMenu.edges}
        programs={programs}
        fbAppId={fbAppId}
        googleOauth2ClientId={googleOauth2ClientId}
      >
        <div className="col-md-12">
          <DefaultNav title="Magazines" link="/magazines" />
        </div>
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'magazine' }}
          numResults={0}
          design={wpPage.acf}
          loadMore={null}
        />
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query magazinePageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        fbAppId
        googleOauth2ClientId
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
    wpPage: wordpressPage(slug: { eq: "magazines" }) {
      slug
      title
      content
      link
      acf {
        videoId
        defaultRowLayout
        defaultDisplayType
        newRowLayout {
          rowLayout
          displayType
        }
      }
    }

    wpMagazine: allWordpressWpMagazine {
      edges {
        node {
          link
          title
          slug
          wordpress_id
          link
          acf {
            coverImage
          }
        }
      }
    }
  }
`;
