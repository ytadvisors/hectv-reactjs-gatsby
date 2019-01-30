import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import _ from 'lodash';

import { getPosts, getPrograms, getExcerpt } from '../utils/helperFunctions';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

export default ({ data }) => {
  const {
    wpEvent: { title, thumbnail, content, link = '', slug } = {},
    wpSite: { siteMetadata: { siteUrl, fbAppId, googleOauth2ClientId } = {} },
    wpSchedule: { edges } = {},
    wpMenu
  } = data;

  const programs = getPrograms(edges, 5);

  const description =
    content || 'On Demand Arts, Culture & Education Programming';
  let posts = getPosts(data, 'wpEvent', 'eventPosts', 'eventPost');
  posts = _.take(posts, 3);

  return (
    <Fragment>
      <SEO
        {...{
          title,
          image: thumbnail,
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
          <SinglePost {...{ post: data.wpEvent }} />
          <ListOfPosts
            title="Related Posts"
            posts={posts || []}
            link={{ page: 'posts' }}
            numResults={0}
            style={{
              background: '#f9f9f9',
              marginBottom: '20px',
              border: '1px solid #ddd'
            }}
            design={{
              defaultRowLayout: '3 Columns',
              defaultDisplayType: 'Post'
            }}
            loadMore={null}
            resizeRows
          />
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query eventQuery($id: String!) {
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
    wpEvent: wordpressWpEvent(id: { eq: $id }) {
      title
      content
      link
      thumbnail
      slug
      acf {
        venue
        webAddress
        eventPrice
        eventDates {
          startTime
          endTime
        }
        eventPosts {
          eventPost {
            postTitle
            postExcerpt
            postName
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
