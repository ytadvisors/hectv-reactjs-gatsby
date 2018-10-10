import React, {Component} from "react";
import { graphql } from "gatsby";
import { connect } from 'react-redux';
import {
  loadSearchPostsAction
} from './../store/actions/postActions';
import SEO from "./../components/SEO";
import Layout from "./../components/Layout";
import DefaultNav from './../components/SubNavigation/DefaultNav';
import ListOfPosts from "./../components/ListOfPosts";

class Search extends Component {
  constructor(props){
    super(props);
    this.loadPage = this.loadPage.bind(this);
  }

  componentDidMount(){
    const {
      location : {pathname}
    } = this.props;

    this.loadPage(pathname);
  }

  componentDidUpdate(prevProps){
    if(prevProps.location.pathname !== this.props.location.pathname){
      this.loadPage(this.props.location.pathname);
    }
  }

  loadPage(pathname){
    const {
      dispatch,
      data : {
        wpSite: {
          siteMetadata : {
            apiUrl
          }
        }
      }
    } = this.props;

    const [,searchText, searchValue] = pathname.split("/");
    dispatch(loadSearchPostsAction(apiUrl, searchValue));
  }

  render(){
    const {
      data,
      posts,
      pageContext: { live_videos},
      location : {pathname}
    } = this.props;

    let description = "On Demand Arts, Culture & Education Programming";
    const [,searchText, searchValue] = pathname.split("/");

    return <div>
      <SEO
        {...{
          title : `HEC-TV | Search`,
          image : "",
          description : description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 320) + '...',
          url: data.wpSite.siteMetadata.siteUrl,
          fb_app_id: data.wpSite.siteMetadata.fbAppId,
          pathname: data.wpSite.siteMetadata.siteUrl + "/search",
          site_name : "hecmedia.org",
          author: "hectv",
          twitter_handle : "@hec_tv"
        }}
      />
      <Layout
        live_videos={live_videos}
      >
        <div className="col-md-12">
          <DefaultNav title={`Results: ${searchValue}`} link="/magazines"/>
        </div>
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          num_results={0}
          design={null}
          loadMore={null}
          resize_rows
        />
      </Layout>
    </div>
  }
};

const mapStateToProps = (state, ownProps) => ({
  posts: state.postReducers.posts,
  current_page: state.postReducers.current_page
});

export default connect(mapStateToProps)(Search);

export const query = graphql`
query searchPageQuery{
  wpSite: site {
    siteMetadata{
      siteUrl
      apiUrl
      fbAppId
    }
  }
}
`;