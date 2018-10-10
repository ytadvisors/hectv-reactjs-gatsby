import React, {Component} from "react";
import {graphql} from "gatsby"
import moment from "moment";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import EventNav from './../components/SubNavigation/EventNav';
import { getCurrentEvents, getFirstImageFromWpList } from "./../utils/helperFunctions"
import ListOfPosts from "./../components/ListOfPosts";

export default class Events extends Component{

  constructor(props) {
    super(props);
    this.state = {
      current_date: moment(moment().format('MM/DD/YYYY'))
    }
  }

  changeDate(new_date){
    this.setState({current_date : moment(new_date)})
  }

  render() {
    const {
      data,
      pageContext: { live_videos}
    } = this.props;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let events = data.wpEvents && data.wpEvents.edges || [];
    let current_events = getCurrentEvents(this.state.current_date, events);
    let posts = current_events && current_events.values && current_events.values.map(obj => obj.node);
    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
    let select_title =  data.wpEventCategory && data.wpEventCategory.name || "Filter Events";

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
            <EventNav {...data.wpPage} changeDate={this.changeDate.bind(this)}  select_title={select_title} />
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

export const query = graphql`
query eventTypeQuery ($categories: [ Int ] $wordpress_id : Int){
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
 wpEvents: allWordpressWpEvent(
    filter: {
        event_category : { in : $categories }
    }
    sort :{
      fields: [acf___event_dates]
      order:ASC
    }
  ){
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
  wpEventCategory: wordpressWpEventCategory ( wordpress_id : {eq: $wordpress_id}){
    name
    wordpress_id
  }
}
`;