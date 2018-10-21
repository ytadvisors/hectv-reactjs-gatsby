import React, { Component} from "react";
import {graphql} from "gatsby"
import { connect } from 'react-redux';

import {
  loadLiveVideosAction
} from "./../store/actions/postActions"
import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"
import DefaultNav from './../components/SubNavigation/DefaultNav';

class Template2Page extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
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

    let title = data.wpPage.title;

    if (data.wpPage.acf)
      data.wpPage.acf.content = data.wpPage.content;

    let description = data.wpPage.content || "On Demand Arts, Culture & Education Programming";
    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${title}`,
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
      >
        <div>
          <div className="col-md-12">
            <DefaultNav title={title} link={data.wpPage.link}/>
          </div>
          <div className="col-md-12">
            <SinglePost {...{post: data.wpPage}} hideTitle/>
          </div>
        </div>
      </Layout>
    </div>
  }
}


const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Template2Page);
export const query = graphql`
query template2PageQuery($slug: String!) {
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpPage: wordpressPage(slug: {eq: $slug}) {
    slug
    title
    content
    link
    template
  }
}`;