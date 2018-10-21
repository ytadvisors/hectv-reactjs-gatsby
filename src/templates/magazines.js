import React, { Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"
import { getFirstImageFromWpList } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

class Magazines extends Component {
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

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let posts = data.wpMagazine && data.wpMagazine.edges.map(obj => obj.node);
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
            <DefaultNav title="Magazines" link="/magazines"/>
          </div>
          <ListOfPosts
            posts={posts || []}
            link={{page: 'magazine'}}
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

export default connect(mapStateToProps)(Magazines);

export const query = graphql`
query magazinePageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpPage: wordpressPage(slug: {eq: "magazines"}) {
    slug
    title
    content
    link
    acf {
      video_id
      default_row_layout
      default_display_type
      new_row_layout {
        row_layout
        display_type
      }
    }
  }
  
 wpMagazine: allWordpressWpMagazine{
    edges {
      node {
        link
        title
        slug
        wordpress_id
        link
        acf {
          cover_image
        }
      }
    }
  }
}`;