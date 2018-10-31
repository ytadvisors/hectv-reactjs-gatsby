import React, { Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"

import {
  getPrograms
} from "./../utils/helperFunctions"
import Map from '../components/Map';
import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import DefaultNav from './../components/SubNavigation/DefaultNav';
import Template3 from "../components/Templates/template-3/index";


function callbackFunc(){
  console.log("Done");
}

class Template3Page extends Component {
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

    let title = data.wpPage.title;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${data.wpPage.title}`,
          image: "",
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
            <DefaultNav title={title} link={data.wpPage.link}/>
          </div>
          <Template3 {...{page_content: data.wpPage.acf}} callbackFunc={callbackFunc}>
            <Map mapKey={data.wpSite.siteMetadata.mapKey}/>
          </Template3>
        </div>
      </Layout>
    </div>
  }
}


const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Template3Page);
export const query = graphql`
query template3PageQuery($slug: String!) {
  wpSite: site {
    siteMetadata{
      siteUrl
      mapKey
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
  wpPage: wordpressPage(slug: {eq: $slug}) {
    slug
    title
    content
    link
    template
    acf {
      address
      phone_number
      fax_number
      directions
      opportunities
      tv_providers {
        provider
        channel
      }
      team {
        name
        position
        email
      }
    }
  }
  
}`;