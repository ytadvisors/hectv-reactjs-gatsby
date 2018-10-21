import React, { Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"
import { removeDuplicates, getPosts, getFirstImageFromWpList } from "./../utils/helperFunctions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout";
import ListOfPosts from "./../components/ListOfPosts";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.loadLive();
  }

  loadLive = () => {
    const {
      dispatch
    } = this.props;
    dispatch(loadLiveVideosAction());
    setTimeout(this.loadLive, 30000);
  };

  render() {

    const {
      data,
      live_videos
    } = this.props;


    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
    let posts = getPosts(data, "wpPage", "post_list", "post", "wpPosts");
    posts = removeDuplicates(posts, "wordpress_id");

    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${data.wpPage.title}`,
          image: getFirstImageFromWpList(posts),
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          fb_app_id: data.wpSite.siteMetadata.fbAppId,
          pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hecmedia.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout
        showBottomNav
        slug={data.wpPage.slug}
        live_videos={live_videos}
      >
        <ListOfPosts
          posts={posts || []}
          link={{page: 'posts'}}
          num_results={0}
          design={data.wpPage.acf}
          loadMore={null}
          resize_rows
        />
      </Layout>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Home);

export const query = graphql`
query homePageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
 wpPage: wordpressPage (slug : { eq : "home" }) {
   title
   content
   link
   slug
   acf{
     default_row_layout
     default_display_type
     new_row_layout {
       row_layout
       display_type
     }
     post_list{
      post{
        post_title
        post_name
        post_excerpt
        wordpress_id
        categories {
          link
          name
        }
        acf{
          is_video
          video_image{
            sizes{
              medium
              medium_large
            }
          }
          post_header{
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
 wpPosts: allWordpressPost (limit:10){
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