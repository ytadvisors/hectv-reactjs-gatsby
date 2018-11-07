import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import {
  loadSearchPostsAction,
  loadLiveVideosAction
} from '../store/actions/postActions';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import ListOfPosts from '../components/ListOfPosts';

class Search extends Component {
  constructor(props) {
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.state = {
      programs: {}
    };
  }

  componentDidMount() {
    const {
      location: { pathname }
    } = this.props;
    this.loadPage(pathname);
    this.loadLive();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname } = {} } = this.props;
    if (prevProps.location.pathname !== pathname) {
      this.loadPage(pathname);
    }
  }

  loadLive = () => {
    const { dispatch, data: { wpSchedule: { edges } = {} } = {} } = this.props;
    dispatch(loadLiveVideosAction());
    this.setState({
      programs: getPrograms(edges, 5)
    });
    setTimeout(this.loadLive, 30000);
  };

  loadPage(pathname) {
    const {
      dispatch,
      data: {
        wpSite: {
          siteMetadata: { apiUrl }
        }
      }
    } = this.props;

    const [, , searchValue] = pathname.split('/');
    dispatch(loadSearchPostsAction(apiUrl, searchValue));
  }

  render() {
    const {
      data,
      posts,
      liveVideos,
      location: { pathname }
    } = this.props;
    const { programs } = this.state;

    const description = 'On Demand Arts, Culture & Education Programming';
    const [, , searchValue] = pathname.split('/');

    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | Search`,
            image: '',
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: `${data.wpSite.siteMetadata.siteUrl}/search`,
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout liveVideos={liveVideos} programs={programs}>
          <div className="col-md-12">
            <DefaultNav title={`Results: ${searchValue}`} link="/magazines" />
          </div>
          <ListOfPosts
            posts={posts || []}
            link={{ page: 'posts' }}
            numResults={0}
            design={null}
            loadMore={null}
            resizeRows
          />
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.postReducers.posts,
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Search);

export const query = graphql`
  query searchPageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        apiUrl
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
  }
`;
