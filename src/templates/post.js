import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getPosts,
  getPrograms,
  getExcerpt,
  decodeHTML
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';
import PodcastLinks from '../components/PodcastLinks';

const Post = ({ data, liveVideos }) => {
  let categories = [];
  const {
    wpSite: {
      siteMetadata: { siteUrl = '', fbAppId = '', googleOauth2ClientId } = {}
    } = {},
    wpSchedule,
    wpCategory,
    wpMenu,
    wpPost
  } = data;

  if (wpCategory && wpCategory.edges) {
    categories = wpCategory.edges.map(obj => obj.node.name);
  }

  const {
    excerpt,
    content,
    title,
    thumbnail,
    slug,
    link,
    acf: { podcasts }
  } = wpPost;
  const description =
    excerpt || content || 'On Demand Arts, Culture & Education Programming';

  let posts = getPosts(
    data,
    'wpPost',
    'relatedPosts',
    'relatedPost',
    'wpRelatedPosts'
  );

  const programs = getPrograms(wpSchedule.edges, 5);
  const events = getPosts(data, 'wpPost', 'postEvents', 'relatedEvent');
  const pathname = link.replace(/https?:\/\/[^/]+/, '');
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
          pathname,
          siteName: 'hecmedia.org',
          author: 'hectv',
          twitterHandle: '@hec_tv',
          categories
        }}
      />
      <Layout
        style={{ background: '#eee' }}
        menus={wpMenu.edges}
        slug={slug}
        programs={programs}
        fbAppId={fbAppId}
        googleOauth2ClientId={googleOauth2ClientId}
      >
        <div className="col-md-12" style={{ background: '#eee' }}>
          <SinglePost
            {...{
              post: wpPost,
              liveVideos,
              pageTitle: decodeHTML(title || ''),
              pageUrl: `${siteUrl}${pathname}`,
              showShareIcons: true
            }}
          />
          <PodcastLinks podcasts={podcasts} />
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
          <ListOfPosts
            title="Related Events"
            posts={events}
            link={{ page: 'events' }}
            numResults={0}
            design={{
              defaultRowLayout: 'Single Column',
              defaultDisplayType: 'Wallpaper'
            }}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Post);

export const query = graphql`
  query postQuery($id: String!, $categories: [Int]!) {
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
    wpPost: wordpressPost(id: { eq: $id }) {
      title
      content
      excerpt
      thumbnail
      link
      slug
      acf {
        youtubeId
        vimeoId
        isVideo
        embedUrl
        relatedPosts {
          relatedPost {
            postTitle
            postExcerpt
            postName
            categories {
              name
              link
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
        postEvents {
          relatedEvent {
            postExcerpt
            postTitle
            postName
            acf {
              venue
              eventPrice
              eventDates {
                startTime
                endTime
              }
              eventImage {
                sizes {
                  medium
                  mediumLarge
                }
              }
            }
          }
        }
        podcasts {
          podcast
          podcastLink
        }
      }
    }
    wpCategory: allWordpressCategory(
      filter: { wordpress_id: { in: $categories } }
    ) {
      edges {
        node {
          name
          slug
          link
        }
      }
    }
    wpRelatedPosts: allWordpressPost(
      limit: 3
      filter: {
        categories: { elemMatch: { wordpress_id: { in: $categories } } }
      }
    ) {
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
