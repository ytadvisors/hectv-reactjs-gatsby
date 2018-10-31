import React, { Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';
import {
  loadLiveVideosAction
} from "./../store/actions/postActions"

import {
  getPosts,
  getPrograms
} from "./../utils/helperFunctions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import ListOfPosts from "./../components/ListOfPosts";
import _ from "lodash"

class Event extends Component {
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

    let description = data.wpEvent.content || "On Demand Arts, Culture & Education Programming";
    let posts = getPosts(data, "wpEvent", "event_posts", "event_post");
    posts = _.take(posts, 3);

    return <div>
      <SEO
        {...{
          title: data.wpEvent.title,
          image: data.wpEvent.thumbnail,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          fb_app_id: data.wpSite.siteMetadata.fbAppId,
          pathname: data.wpEvent.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hecmedia.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout
        slug={data.wpEvent.slug}
        live_videos={live_videos}
        programs={this.state.programs}
      >
        <div className="col-md-12">
          <SinglePost {...{post: data.wpEvent}} />
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
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Event);

export const query = graphql`
query eventQuery ($id: String!){
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
        acf {
          schedule_programs {
            program_start_time
            program_end_time
            program_title
            program_start_date
          }
        }
      }
    }
  }
  wpEvent: wordpressWpEvent (id : { eq : $id }) {
    title
    content
    link
    thumbnail
    slug
    acf {
      venue
      web_address
      event_price
      event_dates{
        start_time
        end_time
      }
      event_posts{
        event_post{
          post_title
          post_excerpt
          post_name
          acf {
            is_video
            video_image{
              sizes{
                medium
                medium_large
              }
            }
            post_header {
              sizes {
                medium
                medium_large
              }
            }
          }
        }
      }
    }
  }
}
`;