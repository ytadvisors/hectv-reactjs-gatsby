import React, { Component} from "react";
import { graphql } from "gatsby";
import { connect } from 'react-redux';
import {
  loadLiveVideosAction
} from "./../store/actions/postActions"
import { getPosts, getPrograms } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout";
import SinglePost from "./../components/SinglePost";
import ListOfPosts from "./../components/ListOfPosts";
import _ from "lodash"

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs : {}
    };
  }

  componentDidMount(){
    this.loadLive();
  }

  loadLive = () => {
    const {
      dispatch,
      data : {
        wpSchedule : {
          edges
        } = {}
      } = {}
    } = this.props;
    dispatch(loadLiveVideosAction());
    this.setState({
      programs : getPrograms(edges, 5)
    });
    setTimeout(this.loadLive, 30000);
  };

  render() {

    const {
      data,
      live_videos
    } = this.props;

    const {
      excerpt,
      content,
      title,
      thumbnail,
      slug,
      link
    } = data.wpPost;
    let description = excerpt || content || "On Demand Arts, Culture & Education Programming";

    let posts = getPosts(data, "wpPost", "related_posts", "related_post", "wpRelatedPosts");
    let events = getPosts(data, "wpPost", "post_events", "related_event");
    posts = _.take(posts, 3);
    return <div>
      <SEO
        {...{
          title: title,
          image: thumbnail,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          fb_app_id: data.wpSite.siteMetadata.fbAppId,
          pathname: link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hecmedia.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout
        style={{background: '#eee'}}
        slug={slug}
        live_videos={live_videos}
        programs={this.state.programs}
      >
        <div className="col-md-12" style={{background: '#eee'}}>
          <SinglePost {
                        ...{
                          post: data.wpPost,
                          live_videos: live_videos
                        }
                      } />
          <ListOfPosts
            title="Related Posts"
            posts={posts || []}
            link={{page: 'posts'}}
            num_results={0}
            style={{
              background: '#f9f9f9',
              marginBottom: '20px',
              border: '1px solid #ddd'
            }}
            design={{
              default_row_layout: '3 Columns',
              default_display_type: 'Post'
            }}
            loadMore={null}
            resize_rows
          />
          <ListOfPosts
            title="Related Events"
            posts={events}
            link={{page: 'events'}}
            num_results={ 0}
            design={{
              default_row_layout: 'Single Column',
              default_display_type: 'Wallpaper'
            }}
          />
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Post);

export const query = graphql`
query postQuery ($id: String! $categories: [Int]!){
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpSchedule : allWordpressWpSchedules {
    edges{
      node{
        slug
        title
        link
        acf{
          schedule_programs{
            program_start_time
            program_end_time
            program_title
            program_start_date
          }
        }
      }
    }
  }
 wpPost: wordpressPost (id : { eq : $id }) {
    title
    content
    excerpt
    thumbnail
    link
    slug
    acf {
      youtube_id
      vimeo_id
      is_video
      embed_url
      related_posts {
        related_post{
          post_title
          post_excerpt
          post_name
          categories{
            name
            link
          }
          acf{
            is_video
            video_image{
              sizes{
                medium
                medium_large
              }
            }
          }
        }
      }
      post_events {
        related_event{
          post_excerpt
          post_title
          post_name
          acf{
          	venue
            event_price
            event_dates {
            	start_time
              end_time
          	}
            event_image{
              sizes{
                medium
                medium_large
              }
            }
          }
        }
      }
    }
  }
  wpRelatedPosts: allWordpressPost (
    limit : 3
    filter : {
      categories : {
        wordpress_id : {
          in : $categories
        } 
      }
    }
  ){
    edges{
      node{
        link
        title
        excerpt
        slug
        wordpress_id
        categories{
          link
          name
        }
        thumbnail
        acf{
          is_video
        }
      }
    }  
  }
}
`;