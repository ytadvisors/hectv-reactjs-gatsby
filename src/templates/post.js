import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import _ from 'lodash';
import { loadLiveVideosAction } from '../store/actions/postActions';
import { getPosts, getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: {}
    };
  }

  componentDidMount() {
    this.loadLive();
  }

  loadLive = () => {
    const { dispatch, data: { wpSchedule: { edges } = {} } = {} } = this.props;
    dispatch(loadLiveVideosAction());
    this.setState({
      programs: getPrograms(edges, 5)
    });
    setTimeout(this.loadLive, 30000);
  };

  render() {
    const { data, liveVideos } = this.props;
    const { programs } = this.state;

    const { excerpt, content, title, thumbnail, slug, link } = data.wpPost;
    const description =
      excerpt || content || 'On Demand Arts, Culture & Education Programming';

    let posts = getPosts(
      data,
      'wpPost',
      'relatedPosts',
      'relatedPost',
      'wpRelatedPosts'
    );
    const events = getPosts(data, 'wpPost', 'post_events', 'relatedEvent');
    posts = _.take(posts, 3);
    return (
      <div>
        <SEO
          {...{
            title,
            image: thumbnail,
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          style={{ background: '#eee' }}
          slug={slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <div className="col-md-12" style={{ background: '#eee' }}>
            <SinglePost
              {...{
                post: data.wpPost,
                liveVideos
              }}
            />
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
      </div>
    );
  }
}

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
            }
          }
        }
        post_events {
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
      }
    }
    wpRelatedPosts: allWordpressPost(
      limit: 3
      filter: { categories: { wordpress_id: { in: $categories } } }
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
