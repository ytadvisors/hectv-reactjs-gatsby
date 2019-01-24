import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';

import { loadLiveVideosAction } from '../store/actions/postActions';
import {
  removeDuplicates,
  getPosts,
  getPrograms,
  getFirstImageFromWpList,
  getExcerpt
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ListOfPosts from '../components/ListOfPosts';

class Home extends Component {
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
    if (this.mounted) {
      const {
        dispatch,
        data: { wpSchedule: { edges } = {} } = {}
      } = this.props;

      dispatch(loadLiveVideosAction());
      this.setState({
        programs: getPrograms(edges, 5)
      });
      setTimeout(this.loadLive, 30000);
    }
  };

  render() {
    const { data, liveVideos } = this.props;

    const {
      wpPage: { content, title, slug, link = '', acf = {} } = {},
      wpSite: { siteMetadata: { siteUrl, fbAppId } = {} } = {}
    } = data;

    const { programs } = this.state;

    const description =
      content || 'On Demand Arts, Culture & Education Programming';
    let posts = getPosts(data, 'wpPage', 'postList', 'post', 'wpPosts');
    posts = removeDuplicates(posts, 'wordpress_id');

    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${title}`,
            image: getFirstImageFromWpList(posts),
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
          showBottomNav
          slug={slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <ListOfPosts
            posts={posts || []}
            link={{ page: 'posts' }}
            numResults={0}
            design={acf}
            loadMore={null}
            resizeRows
          />
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Home);

export const query = graphql`
  query homePageQuery {
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
    wpPage: wordpressPage(slug: { eq: "home" }) {
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
