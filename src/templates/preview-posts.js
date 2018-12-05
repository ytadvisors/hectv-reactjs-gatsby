import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  loadLiveVideosAction,
  loadPostWithSlugAction
} from '../store/actions/postActions';
import { getPosts, getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import ListOfPosts from '../components/ListOfPosts';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: {}
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.loadLive();
    this.loadPost();
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

  loadPost = () => {
    const { dispatch, location: { pathname } = {} } = this.props;
    const [, , , searchValue] = pathname.split('/');
    if (searchValue) dispatch(loadPostWithSlugAction(searchValue));
  };

  render() {
    const { data, liveVideos, post = {}, categoryPosts } = this.props;
    const { programs } = this.state;
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

    const description =
      excerpt || content || 'On Demand Arts, Culture & Education Programming';

    let relatedPosts = getPosts(
      postObject,
      'wpPost',
      'relatedPosts',
      'relatedPost'
    );
    relatedPosts = [...relatedPosts, ...categoryRelatedPosts];

    const relatedEvents = getPosts(
      postObject,
      'wpPost',
      'postEvents',
      'relatedEvent'
    );
    relatedPosts = _.take(relatedPosts, 3);
    return (
      <div>
        <SEO
          {...{
            title,
            image: thumbnail,
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          style={{ background: '#eee' }}
          slug={slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <div className="col-md-12" style={{ background: '#eee' }}>
            <SinglePost
              {...{
                post: newPost,
                liveVideos
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos,
  post: state.postReducers.post,
  categoryPosts: state.postReducers.categoryPosts
});

export default connect(mapStateToProps)(Post);

export const query = graphql`
  query previewPostQuery {
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
  }
`;
