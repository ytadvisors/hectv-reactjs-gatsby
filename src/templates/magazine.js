import React, {Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import SinglePost from "./../components/SinglePost"

import "./../utils/cssDependencies";

class Magazine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data} = this.props;
    data.wpMagazine.thumbnail = "";
    if (data.wpMagazine.acf && data.wpMagazine.acf.cover_image)
      data.wpMagazine.thumbnail = data.wpMagazine.acf.cover_image;

    let description = data.wpMagazine.content || "On Demand Arts, Culture &amp; Education Programming";

    return <div>
      <SEO
        {...{
          title: data.wpMagazine.title,
          image: data.wpMagazine.thumbnail,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
          url: process.env.SITE_HOST,
          pathname: data.wpMagazine.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hectv.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout  {...this.props} style={{background: '#eee'}}>
        <div className="col-md-12" style={{background: '#eee'}}>
          <SinglePost {...
            {
              post: data.wpMagazine,
              classes: {
                thumbnail: 'col-md-2 pull-right',
                content: 'col-md-10 no-padding'
              }
            }
                      } />
        </div>
      </Layout>
    </div>
  }
}

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(Magazine);

export const query = graphql`
     query magazineQuery ($id: String!){
       wpMagazine : wordpressWpMagazine (id : { eq : $id }) {
          title
          content
          link
      		acf{
            cover_image
          }
        }
     }
`;