import React, {Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

import "./../utils/cssDependencies";

class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data} = this.props;
    let description = data.wpEvent.content || "On Demand Arts, Culture &amp; Education Programming";

    return <div>
      <SEO
        {...{
          title: data.wpEvent.title,
          image: data.wpEvent.thumbnail,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
          url: process.env.SITE_HOST,
          pathname: data.wpEvent.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hectv.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout  {...this.props}>
        <div className="col-md-12">
          <SinglePost {...{post: data.wpEvent}} />
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(Event);

export const query = graphql`
   query eventQuery ($id: String!){
     wpEvent: wordpressWpEvent (id : { eq : $id }) {
        title
        content
        link
        thumbnail
      	acf {
      	  venue
          web_address
          event_price
          event_dates{
            start_time
            end_time
          }
        }
      }
   }
`;