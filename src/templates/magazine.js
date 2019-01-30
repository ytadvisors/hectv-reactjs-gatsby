import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { getPosts, getPrograms, getExcerpt } from '../utils/helperFunctions';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

export default ({ data }) => {
  const {
    wpSchedule: { edges } = {},
    wpMenu,
    wpSite: {
      siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
    } = {},
    wpMagazine
  } = data;

  const programs = getPrograms(edges, 5);
  const pageInfo = { ...wpMagazine };

  pageInfo.thumbnail = '';
  if (pageInfo.acf && pageInfo.acf.coverImage)
    pageInfo.thumbnail = pageInfo.acf.coverImage;

  const description =
    pageInfo.content || 'On Demand Arts, Culture & Education Programming';
  const posts = getPosts(data, 'pageInfo', 'magazinePost', 'post');

  return (
    <Fragment>
      <SEO
        {...{
          title: pageInfo.title,
          image: pageInfo.thumbnail,
          description: getExcerpt(description, 320),
          url: siteUrl,
          fbAppId,
          pathname: pageInfo.link.replace(/https?:\/\/[^/]+/, ''),
          siteName: 'hecmedia.org',
          author: 'hectv',
          twitterHandle: '@hec_tv'
        }}
      />
      <Layout
        style={{ background: '#eee' }}
        slug={pageInfo.slug}
        menus={wpMenu.edges}
        programs={programs}
        fbAppId={fbAppId}
        googleOauth2ClientId={googleOauth2ClientId}
      >
        <div className="col-md-12" style={{ background: '#eee' }}>
          <SinglePost
            {...{
              post: pageInfo,
              classes: {
                thumbnail: 'col-md-2 pull-right',
                content: 'col-md-10 no-padding'
              }
            }}
          />
          <ListOfPosts
            posts={posts || []}
            link={{ page: 'posts' }}
            numResults={0}
            design={{
              defaultRowLayout: '2 Columns',
              defaultDisplayType: 'Post'
            }}
            loadMore={null}
            style={{
              background: '#f9f9f9',
              border: '1px solid #ddd'
            }}
            resizeRows
          />
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query magazineQuery($id: String!) {
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
    pageInfo: wordpressWpMagazine(id: { eq: $id }) {
      title
      content
      link
      slug
      acf {
        coverImage
        magazinePost {
          post {
            postTitle
            postExcerpt
            postName
            acf {
              isVideo
              postHeader {
                sizes {
                  medium
                  mediumLarge
                }
              }
              videoImage {
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
