import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { getPosts, getPrograms, getExcerpt } from '../utils/helperFunctions';
import { loadLiveVideosAction } from '../store/actions/postActions';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

class Magazine extends Component {
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

    data.wpMagazine.thumbnail = '';
    if (data.wpMagazine.acf && data.wpMagazine.acf.coverImage)
      data.wpMagazine.thumbnail = data.wpMagazine.acf.coverImage;

    const description =
      data.wpMagazine.content ||
      'On Demand Arts, Culture & Education Programming';
    const posts = getPosts(data, 'wpMagazine', 'magazinePost', 'post');

    return (
      <div>
        <SEO
          {...{
            title: data.wpMagazine.title,
            image: data.wpMagazine.thumbnail,
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: data.wpMagazine.link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          style={{ background: '#eee' }}
          slug={data.wpMagazine.slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <div className="col-md-12" style={{ background: '#eee' }}>
            <SinglePost
              {...{
                post: data.wpMagazine,
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Magazine);

export const query = graphql`
  query magazineQuery($id: String!) {
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
    wpMagazine: wordpressWpMagazine(id: { eq: $id }) {
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
