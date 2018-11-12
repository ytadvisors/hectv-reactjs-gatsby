import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { loadLiveVideosAction } from '../store/actions/postActions';

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

class Articles extends Component {
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

    if (data.wpPage.acf) data.wpPage.acf.content = data.wpPage.content;
    let posts = getPosts(data, 'wpPage', 'postList', 'post', 'wpPosts');
    posts = removeDuplicates(posts, 'wordpress_id');

    const description =
      data.wpPage.content || 'On Demand Arts, Culture & Education Programming';
    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${data.wpPage.title}`,
            image: getFirstImageFromWpList(posts),
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
          <div>
            <div className="col-md-12">
              <DefaultNav title="Articles" link="/articles" />
            </div>
            <ListOfPosts
              posts={posts || []}
              link={{ page: 'posts' }}
              numResults={0}
              design={data.wpPage.acf}
              loadMore={null}
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

export default connect(mapStateToProps)(Articles);
export const query = graphql`
  query articlesPageQuery {
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
