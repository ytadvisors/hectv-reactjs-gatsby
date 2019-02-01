import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import {
  removeDuplicates,
  getPosts,
  getPrograms,
  getExcerpt
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ListOfPosts from '../components/ListOfPosts';

export default ({ data }) => {
  const {
    wpSchedule,
    wpMenu,
    wpSite: {
      siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
    } = {},
    wpPage
  } = data;

  const programs = getPrograms(wpSchedule.edges, 5);

  const description =
    wpPage.content || 'On Demand Arts, Culture & Education Programming';

  let posts = getPosts(data, 'wpPage', 'postList', 'post', 'wpPosts');
  posts = removeDuplicates(posts, 'wordpress_id');
  let image = '';
  if (posts.length > 0 && posts[0].acf) {
    const imgContainer = posts[0].acf.videoImage || posts[0].acf.postHeader;
    image = imgContainer && imgContainer.sizes ? imgContainer.sizes.medium : '';
  }

  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | ${wpPage.title}`,
          image,
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
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          numResults={0}
          design={wpPage.acf}
          loadMore={null}
          resizeRows
        />
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query sitePageQuery($slug: String!) {
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
    wpPosts: allWordpressPost(limit: 10) {
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
