import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import moment from 'moment';
import { loadLiveVideosAction } from '../store/actions/postActions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import EventNav from '../components/SubNavigation/EventNav';
import {
  getCurrentEvents,
  getFirstImageFromWpList,
  getPrograms,
  getExcerpt
} from '../utils/helperFunctions';
import ListOfPosts from '../components/ListOfPosts';

class EventType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(moment().format('MM/DD/YYYY')),
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

  changeDate = newDate => {
    this.setState({ currentDate: moment(newDate) });
  };

  render() {
    const {
      data,
      liveVideos,
      pageContext: { edges, page, numPages = 1 },
      location: { pathname }
    } = this.props;

    const { currentDate, programs } = this.state;
    if (data.wpPage.acf) data.wpPage.acf.content = data.wpPage.content;

    const events = edges || [];
    const currentEvents = getCurrentEvents(currentDate, events);
    const posts =
      currentEvents &&
      currentEvents.values &&
      currentEvents.values.map(obj => obj.node);

    const [urlPrefix] = pathname.split('page');
    const description =
      data.wpPage.content || 'On Demand Arts, Culture & Education Programming';
    const selectTitle =
      (data.wpEventCategory && data.wpEventCategory.name) || 'Filter Events';

    return (
      <div>
        <SEO
          {...{
            title: `HEC-TV | ${data.wpPage.title}`,
            image: getFirstImageFromWpList(posts),
            description: getExcerpt(description, 320),
            url: data.wpSite.siteMetadata.siteUrl,
            fbAppId: data.wpSite.siteMetadata.fbAppId,
            pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          slug={data.wpPage.slug}
          liveVideos={liveVideos}
          programs={programs}
        >
          <div>
            <div className="col-md-12">
              <EventNav
                {...data.wpPage}
                changeDate={this.changeDate}
                selectTitle={selectTitle}
              />
            </div>
            <ListOfPosts
              posts={posts || []}
              link={{ page: 'events' }}
              numResults={0}
              numPages={numPages}
              urlPrefix={urlPrefix}
              currentPage={page}
              design={data.wpPage.acf}
              loadMore={null}
              resizeRows
            />
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(EventType);

export const query = graphql`
  query eventTypeQuery($wordpress_id: Int) {
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
    wpPage: wordpressPage(slug: { eq: "events" }) {
      slug
      title
      content
      link
      acf {
        videoId
        defaultRowLayout
        defaultDisplayType
        newRowLayout {
          rowLayout
          displayType
        }
      }
    }
    wpEventCategory: wordpressWpEventCategory(
      wordpress_id: { eq: $wordpress_id }
    ) {
      name
      wordpress_id
    }
  }
`;
