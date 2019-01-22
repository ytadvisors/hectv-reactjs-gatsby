import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { loadLiveVideosAction } from '../store/actions/postActions';
import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import CategoryNav from '../components/SubNavigation/CategoryNav';
import ListOfPosts from '../components/ListOfPosts';

class Category extends Component {
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
    this.setState({
      programs: getPrograms(edges, 5)
    });
    setTimeout(this.loadLive, 30000);
  };

  render() {
    const {
      data: { wpCategory, wpSite } = {},
      liveVideos,
      pageContext: { edges, page, numPages = 1 },
      location: { pathname }
    } = this.props;

    const { name, description, link = '', slug = '' } = wpCategory || {};
    const { siteMetadata: { siteUrl, fbAppId } = {} } = wpSite || {};
    const { programs } = this.state;
    const [urlPrefix] = pathname.split('page');

    const pageDescription =
      description || 'On Demand Arts, Culture & Education Programming';
    const pageLink = link.replace(/https?:\/\/[^/]+/, '');

    const posts = edges && edges.map(obj => obj.node);

    let image = '';
    if (posts && posts.length > 0) image = posts[0].thumbnail;
    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${name}`,
            image,
            description: getExcerpt(pageDescription, 320),
            url: siteUrl,
            fbAppId,
            pathname: pageLink,
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout slug={slug} liveVideos={liveVideos} programs={programs}>
          <section>
            <CategoryNav slug={slug} />
            <ListOfPosts
              posts={posts || []}
              link={{ page: 'posts' }}
              urlPrefix={urlPrefix}
              numResults={0}
              numPages={numPages}
              currentPage={page}
              design={null}
              loadMore={null}
              resizeRows
            />
          </section>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Category);

export const query = graphql`
  query categoryQuery($slug: String!) {
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
    wpCategory: wordpressCategory(slug: { eq: $slug }) {
      slug
      link
      name
      description
    }
  }
`;
