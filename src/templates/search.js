import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { loadSearchPostsAction } from '../store/actions/postActions';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import ListOfPosts from '../components/ListOfPosts';

class Search extends Component {
  componentDidMount() {
    this.mounted = true;
    const {
      location: { pathname }
    } = this.props;
    this.loadPage(pathname);
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname } = {} } = this.props;
    if (prevProps.location.pathname !== pathname) {
      this.loadPage(pathname);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadPage = pathname => {
    if (this.mounted) {
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
  };

  render() {
    const {
      data,
      posts,
      location: { pathname }
    } = this.props;

    const {
      wpSchedule: { edges } = {},
      wpSite: {
        siteMetadata: { siteUrl = '', fbAppId = '', googleOauth2ClientId } = {}
      } = {}
    } = data;
    const programs = getPrograms(edges, 5);

    const description = 'On Demand Arts, Culture & Education Programming';
    const [, , searchValue] = pathname.split('/');

    return (
      <Fragment>
        <SEO
          {...{
            title: `HEC-TV | Search`,
            image: '',
            description: getExcerpt(description, 320),
            url: siteUrl,
            fbAppId,
            pathname: `${siteUrl}/search`,
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          programs={programs}
          menus={data.wpMenu.edges}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
          <div className="col-md-12">
            <DefaultNav
              title={`Results: ${decodeURI(searchValue)}`}
              link={`/search/${searchValue}`}
            />
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.postReducers.posts
});

export default connect(mapStateToProps)(Search);

export const query = graphql`
  query searchPageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        apiUrl
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
  }
`;
