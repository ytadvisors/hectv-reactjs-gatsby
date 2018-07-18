import React, {Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

import "./../utils/cssDependencies";

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data} = this.props;
    let description = data.wpPost.content || "On Demand Arts, Culture &amp; Education Programming";
    return <div>
      <SEO
        {...{
          title: data.wpPost.title,
          image: data.wpPost.thumbnail,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
          url: process.env.SITE_HOST,
          pathname: data.wpPost.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hectv.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout  {...this.props} style={{background: '#eee'}}>
        <div className="col-md-12" style={{background: '#eee'}}>
          <SinglePost {...{post: data.wpPost}} />
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(Post);

export const query = graphql`
   query postQuery ($id: String!){
     wpPost: wordpressPost (id : { eq : $id }) {
        title
        content
        thumbnail
        link
        acf {
          youtube_id
          vimeo_id
        }
      }
   }
`;