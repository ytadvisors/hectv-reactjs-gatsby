import React, {Component} from "react";
import {graphql} from "gatsby"
import moment from "moment";

import "./../utils/cssDependencies";

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import EventNav from './../components/SubNavigation/EventNav';
import { getCurrentEvents } from"./../components/ListOfEvents"
import ListOfPosts from "./../components/ListOfPosts";

export default class Events extends Component{

  constructor(props) {
    super(props);
    this.state = {
      current_date: moment(moment().format('MM/DD/YYYY'))
    }
  }

  changeDate(new_date){
    console.log("new date is", new_date);
    this.setState({current_date : moment(new_date)})
  }

  render() {
    const {
      data
    } = this.props;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let current_events = getCurrentEvents(this.state.current_date, data.wpEvents.edges);
    let posts = current_events && current_events.values && current_events.values.map(obj => obj.node);
    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";

    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${data.wpPage.title}`,
          image: "",
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hectv.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout slug={data.wpPage.slug}>
        <div>
          <div className="col-md-12">
            <EventNav {...data.wpPage} changeDate={this.changeDate.bind(this)}/>
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
query eventPageQuery {
  wpSite: site {
    siteMetadata{
      siteUrl
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