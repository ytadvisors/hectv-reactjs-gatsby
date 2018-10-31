import React, { Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"
import { getFirstImageFromWpList, getPrograms } from "./../utils/helperFunctions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

class Magazines extends Component {
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
        programs={this.state.programs}
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