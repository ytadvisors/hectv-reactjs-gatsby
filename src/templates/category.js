import React, { Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';
import {
  loadLiveVideosAction
} from "./../store/actions/postActions"

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import CategoryNav from './../components/SubNavigation/CategoryNav';
import ListOfPosts from "./../components/ListOfPosts";

class Category extends Component {
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

    let description = "";
    let name = "";
    let link = "";
    let slug = "";

    if (data.wpCategory) {
      name = data.wpCategory.name;
      description = data.wpCategory.description || "On Demand Arts, Culture & Education Programming";
      link = data.wpCategory.link && data.wpCategory.link.replace(/https?:\/\/[^/]+/, '');
      slug = data.wpCategory.slug || "";
    }

    let posts = data.wpCategoryPosts && data.wpCategoryPosts.edges.map(obj => obj.node);

    let image = "";
    if (posts && posts.length > 0)
      image = posts[0].thumbnail;
    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${name}`,
          image: image,
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          fb_app_id: data.wpSite.siteMetadata.fbAppId,
          pathname: link,
          site_name: "hecmedia.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout
        slug={slug}
        live_videos={live_videos}
      >
        <section>
          <CategoryNav slug={slug}/>
          <ListOfPosts
            posts={posts || []}
            link={{page: 'posts'}}
            num_results={0}
            design={null}
            loadMore={null}
            resize_rows
          />
        </section>
      </Layout>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  live_videos: state.postReducers.live_videos
});

export default connect(mapStateToProps)(Category);

export const query = graphql`
query categoryQuery ($slug: String!){
  wpSite: site {
    siteMetadata{
      siteUrl
      fbAppId
    }
  }
  wpCategory: wordpressCategory (
    slug : { eq : $slug }
  ){
    slug
    link
    name
    description
  }
  wpCategoryPosts: allWordpressPost(
    filter: {
      categories : 
        { 
            slug :
              { eq: $slug }
        }
    }
  ) {
    edges{
      node {
        slug
        link
        title
        excerpt
        thumbnail
        categories {
          name
          link
          slug
        }
        acf{
          is_video
        }
      }
    }
  }
  }
`;