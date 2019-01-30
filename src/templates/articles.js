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
    wpSchedule,
    wpSite: {
      siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
    } = {},
    pageContext: { page, edges, numPages = 1 },
    wpMenu,
    wpPage
  } = data;

  const programs = getPrograms(wpSchedule.edges, 5);
  const pageInfo = { ...wpPage.acf };
  if (pageInfo) pageInfo.content = wpPage.content;

  const description =
    wpPage.content || 'On Demand Arts, Culture & Education Programming';
  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | ${wpPage.title}`,
          image: getFirstImageFromWpList(edges),
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
          <DefaultNav title="Articles" link="/articles" />
        </div>
        <ListOfPosts
          posts={edges || []}
          link={{ page: 'posts' }}
          numResults={0}
          design={pageInfo}
          loadMore={null}
          numPages={numPages}
          currentPage={page}
        />
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query articlesPageQuery {
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
    wpPage: wordpressPage(slug: { eq: "articles" }) {
      title
      content
      link
      slug
      acf {
        defaultRowLayout
        defaultDisplayType
        newRowLayout {
          rowLayout
          displayType
        }
        postList {
          post {
            postTitle
            postName
            postExcerpt
            wordpress_id
            categories {
              link
              name
            }
            acf {
              isVideo
              videoImage {
                sizes {
                  medium
                  mediumLarge
                }
              }
              postHeader {
                sizes {
                  medium
                  mediumLarge
                }
              }
            }
          }
        }
      }
    }
  }
`;
