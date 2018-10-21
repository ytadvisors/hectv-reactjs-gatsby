import React, { Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';
import {
  loadLiveVideosAction
} from "./../store/actions/postActions"

import {
  removeDuplicates,
  getPosts,
  getFirstImageFromWpList
} from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

class Articles extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const {
      dispatch
    } = this.props;

    dispatch(loadLiveVideosAction());
  }

  render() {
    const {
      data,
      live_videos
    } = this.props;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;
    let posts = getPosts(data, "wpPage", "post_list", "post", "wpPosts");
    posts = removeDuplicates(posts, "wordpress_id");

    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
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
        slug={data.wpPage.slug}
        live_videos={live_videos}
      >
        <div>
          <div className="col-md-12">
            <DefaultNav title="Articles" link="/articles"/>
          </div>
          <ListOfPosts
            posts={posts || []}
            link={{page: 'posts'}}
            num_results={0}
            design={data.wpPage.acf}
            loadMore={null}
          />
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Articles);
export const query = graphql`
query articlesPageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
 wpPage: wordpressPage (slug : { eq : "articles" }) {
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
  wpPosts: allWordpressPost (
    filter : {
      acf : {
        is_video : { eq : false }
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
}`;