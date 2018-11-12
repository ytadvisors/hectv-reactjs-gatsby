import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';

import { loadLiveVideosAction } from '../store/actions/postActions';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import SinglePost from '../components/SinglePost';
import DefaultNav from '../components/SubNavigation/DefaultNav';

class Template2Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: {}
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.loadLive();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadLive = () => {
    const { dispatch, data: { wpSchedule: { edges } = {} } = {} } = this.props;
    dispatch(loadLiveVideosAction());
    if (this.mounted)
      this.setState({
        programs: getPrograms(edges, 5)
      });
    setTimeout(this.loadLive, 30000);
  };

  render() {
    const { data, liveVideos } = this.props;

    const {
      wpPage: { title, content, link = '', slug } = {},
      wpSite: { siteMetadata: { siteUrl, fbAppId } = {} } = {}
    } = data;

    const post = { ...data.wpPage };
    const { programs } = this.state;
    post.acf.content = content;

    const description =
      content || 'On Demand Arts, Culture & Education Programming';

    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${title}`,
            image: '',
            description: getExcerpt(description, 320),
            url: siteUrl,
            fbAppId,
            pathname: link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout slug={slug} liveVideos={liveVideos} programs={programs}>
          <div>
            <div className="col-md-12">
              <DefaultNav title={title} link={link} />
            </div>
            <div className="col-md-12">
              <SinglePost {...{ post }} hideTitle />
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Template2Page);
export const query = graphql`
  query template2PageQuery($slug: String!) {
    wpSite: site {
      siteMetadata {
        siteUrl
        fbAppId
      }
    }
    wpSchedule: allWordpressWpSchedules {
      edges {
        node {
          slug
          title
          link
          acf {
            schedulePrograms {
              programStartTime
              programEndTime
              programTitle
              programStartDate
            }
          }
        }
      }
    }
    wpPage: wordpressPage(slug: { eq: $slug }) {
      slug
      title
      content
      link
      template
    }
  }
`;
