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

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: {}
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.loadLive();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadLive = () => {
    const { dispatch, data: { wpSchedule: { edges } = {} } = {} } = this.props;
    dispatch(loadLiveVideosAction());
    if (this.mounted)
      this.setState({
        programs: getPrograms(edges, 5)
      });
    setTimeout(this.loadLive, 30000);
  };

  render() {
    const { data, liveVideos } = this.props;

    const {
      wpEvent: { title, thumbnail, content, link = '', slug } = {},
      wpSite: { siteMetadata: { siteUrl, fbAppId } = {} }
    } = data;

    const { programs } = this.state;

    const description =
      content || 'On Demand Arts, Culture & Education Programming';
    let posts = getPosts(data, 'wpEvent', 'eventPosts', 'eventPost');
    posts = _.take(posts, 3);

    return (
      <div>
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
        <Layout slug={slug} liveVideos={liveVideos} programs={programs}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Event);

export const query = graphql`
  query eventQuery($id: String!) {
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
