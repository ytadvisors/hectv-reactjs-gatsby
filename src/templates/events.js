import React, {Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';
import moment from "moment";

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"

import {
  getPrograms
} from "./../utils/helperFunctions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import EventNav from './../components/SubNavigation/EventNav';
import { getCurrentEvents, getFirstImageFromWpList } from "./../utils/helperFunctions"
import ListOfPosts from "./../components/ListOfPosts";

class Events extends Component{

  constructor(props) {
    super(props);
    this.state = {
      current_date: moment(moment().format('MM/DD/YYYY')),
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

  changeDate(new_date){
    this.setState({current_date : moment(new_date)})
  }

  render() {
    const {
      data,
      live_videos
    } = this.props;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let events = data.wpEvents && data.wpEvents.edges || [];
    let current_events = getCurrentEvents(this.state.current_date, events);
    let posts = current_events && current_events.values && current_events.values.map(obj => obj.node);
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
            <EventNav {...data.wpPage} changeDate={this.changeDate.bind(this)} select_title="Filter Events"/>
          </div>
          <ListOfPosts
            posts={posts || []}
            link={{page: 'events'}}
            num_results={0}
            design={data.wpPage.acf}
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

export default connect(mapStateToProps)(Events);

export const query = graphql`
query eventPageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpPage: wordpressPage(slug: {eq: "events"}) {
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
  
  wpEvents: allWordpressWpEvent (
  sort :{
    fields: [acf___event_dates]
    order:ASC
  }){
    edges{
      node{
        slug
        title
        link
        thumbnail
        acf{
          venue
          event_price
          
          event_dates{
            start_time
            end_time
          }
        }
      }
    }
  }
}`;