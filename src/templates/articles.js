import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import {
  removeDuplicates,
  getPosts,
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
    wpSite: {
      siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
    } = {},
    wpMenu,
    wpPage
  } = data;

  const programs = getPrograms(edges, 5);
  const pageInfo = { ...wpPage.acf };
  if (pageInfo) pageInfo.content = wpPage.content;
  let posts = getPosts(data, 'wpPage', 'postList', 'post', 'wpPosts');
  posts = removeDuplicates(posts, 'wordpress_id');

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
          <DefaultNav title="Articles" link="/articles" />
        </div>
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          numResults={0}
          design={pageInfo}
          loadMore={null}
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
    wpPosts: allWordpressPost(filter: { acf: { isVideo: { eq: false } } }) {
      edges {
        node {
          link
          title
          excerpt
          slug
          wordpress_id
          categories {
            link
            name
          }
          thumbnail
          acf {
            isVideo
          }
        }
      }
    }
  }
`;
