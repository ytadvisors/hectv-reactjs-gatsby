import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import queryString from 'query-string';

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
      location: { search }
    } = this.props;
    this.loadPage(search);
  }

  componentDidUpdate(prevProps) {
    const { location: { search } = {} } = this.props;
    if (prevProps.location.search !== search) {
      this.loadPage(search);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadPage = searchQuery => {
    const query = queryString.parse(searchQuery.toLowerCase());
    if (this.mounted) {
      const {
        dispatch,
        data: {
          wpSite: {
            siteMetadata: { apiUrl }
          }
        }
      } = this.props;

      if (query.q) dispatch(loadSearchPostsAction(apiUrl, query.q));
    }
  };

  render() {
    const {
      data,
      posts,
      location: { search }
    } = this.props;

    const {
      wpSchedule,
      wpSite: {
        siteMetadata: { siteUrl = '', fbAppId = '', googleOauth2ClientId } = {}
      } = {},
      wpMenu
    } = data;
    const programs = getPrograms(wpSchedule.edges, 5);

    const description = 'On Demand Arts, Culture & Education Programming';
    const query = queryString.parse(search.toLowerCase());
    const searchValue = query.q || '';

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
          menus={wpMenu.edges}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
          <div className="col-md-12">
            <DefaultNav
              title={`Results: ${decodeURI(searchValue)}`}
              link={`/search/?q=${searchValue}`}
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
