import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import _ from 'lodash';
import querystring from 'query-string';

import { loadPostWithSlugAction } from '../store/actions/postActions';
import {
  getPosts,
  getPrograms,
  getExcerpt,
  decodeHTML
} from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

class Post extends Component {
  componentDidMount() {
    this.mounted = true;
    this.loadPost();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadPost = () => {
    if (this.mounted) {
      const { dispatch, location: { search } = {} } = this.props;
      const { id } = querystring.parse(search) || {};
      if (id) dispatch(loadPostWithSlugAction(id.replace(/\/$/, '')));
    }
  };

  render() {
    const { data, liveVideos, post = {}, categoryPosts } = this.props;
    const { wpSchedule } = data;
    const programs = getPrograms(wpSchedule.edges, 5);

    const {
      wpSite: {
        siteMetadata: { siteUrl = '', fbAppId = '', googleOauth2ClientId } = {}
      } = {},
      wpMenu
    } = data;

    const newPost = {
      ...{
        ...post
      },
      title: post.title ? post.title.rendered : '',
      content: post.content ? post.content.rendered : '',
      excerpt: post.excerpt ? post.excerpt.rendered : ''
    };
    const categoryRelatedPosts = categoryPosts.map(category => ({
      ...{
        ...category
      },
      title: category.title ? category.title.rendered : '',
      content: category.content ? category.content.rendered : '',
      excerpt: category.excerpt ? category.excerpt.rendered : '',
      categories: category.categoryList
    }));

    const {
      excerpt = '',
      content = '',
      title = '',
      thumbnail = '',
      slug = '',
      link = ''
    } = newPost;

    const postObject = {
      wpPost: newPost
    };

    const showPodcasts =
      (newPost && newPost.acf && newPost.acf.showPodcasts) || [];
    const podcasts =
      showPodcasts && wpMenu
        ? wpMenu.edges.reduce((result, menu) =>
            menu.node.name === 'Podcasts' ? menu.node.items : result
          )
        : [];

    const description =
      excerpt || content || 'On Demand Arts, Culture & Education Programming';

    let relatedPosts = getPosts(
      postObject,
      'wpPost',
      'relatedPosts',
      'relatedPost'
    );
    relatedPosts = [...relatedPosts, ...categoryRelatedPosts];

    const pathname = link.replace(/https?:\/\/[^/]+/, '');
    const relatedEvents = getPosts(
      postObject,
      'wpPost',
      'postEvents',
      'relatedEvent'
    );

    relatedPosts = _.take(relatedPosts, 3);
    return (
      <Fragment>
        <SEO
          {...{
            title,
            image: thumbnail,
            description: getExcerpt(description, 320),
            url: siteUrl,
            fbAppId,
            pathname,
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          style={{ background: '#eee' }}
          slug={slug}
          menus={wpMenu.edges}
          programs={programs}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
          <div className="col-md-12" style={{ background: '#eee' }}>
            <SinglePost
              {...{
                post: newPost,
                liveVideos,
                pageTitle: decodeHTML(title || ''),
                pageUrl: `${siteUrl}${pathname}`,
                showShareIcons: true,
                podcasts
              }}
            />
            <ListOfPosts
              title="Related Posts"
              posts={relatedPosts || []}
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
              posts={relatedEvents}
              link={{ page: 'events' }}
              numResults={0}
              design={{
                defaultRowLayout: 'Single Column',
                defaultDisplayType: 'Wallpaper'
              }}
            />
          </div>
        </Layout>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  post: state.postReducers.post,
  liveVideos: state.postReducers.liveVideos,
  categoryPosts: state.postReducers.categoryPosts
});

export default connect(mapStateToProps)(Post);

export const query = graphql`
  query previewPostQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
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
