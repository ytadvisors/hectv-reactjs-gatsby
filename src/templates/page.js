import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';

import { loadLiveVideosAction } from '../store/actions/postActions';
import {
  removeDuplicates,
  getPosts,
  getPrograms,
  getExcerpt
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ListOfPosts from '../components/ListOfPosts';

class Page extends Component {
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
    const { programs } = this.state;

    const description =
      data.wpPage.content || 'On Demand Arts, Culture & Education Programming';

    let posts = getPosts(data, 'wpPage', 'postList', 'post', 'wpPosts');
    posts = removeDuplicates(posts, 'wordpress_id');
    let image = '';
    if (posts.length > 0 && posts[0].acf) {
      const imgContainer = posts[0].acf.videoImage || posts[0].acf.postHeader;
      image =
        imgContainer && imgContainer.sizes ? imgContainer.sizes.medium : '';
    }

    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${data.wpPage.title}`,
            image,
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          slug={data.wpPage.slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <ListOfPosts
            posts={posts || []}
            link={{ page: 'posts' }}
            numResults={0}
            design={data.wpPage.acf}
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

export default connect(mapStateToProps)(Page);

export const query = graphql`
  query sitePageQuery($slug: String!) {
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
    wpPosts: allWordpressPost(filter: { categories: { slug: { eq: $slug } } }) {
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
