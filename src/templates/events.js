import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import _ from 'lodash';
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

class Events extends Component {
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
    const { data, liveVideos } = this.props;
    const { programs, currentDate } = this.state;

    if (data.wpPage.acf) data.wpPage.acf.content = data.wpPage.content;

    const events = (data.wpEvents && data.wpEvents.edges) || [];
    const currentEvents = getCurrentEvents(currentDate, events);
    const posts = [];
    if (currentEvents && currentEvents.values)
      _.keys(currentEvents.values).forEach(key =>
        posts.push(currentEvents.values[key].node)
      );

    const description =
      data.wpPage.content || 'On Demand Arts, Culture & Education Programming';

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
                selectTitle="Filter Events"
              />
            </div>
            <ListOfPosts
              posts={posts || []}
              link={{ page: 'events' }}
              numResults={0}
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

export default connect(mapStateToProps)(Events);

export const query = graphql`
  query eventPageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        fbAppId
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

    wpEvents: allWordpressWpEvent(
      sort: { fields: [acf___eventDates], order: ASC }
    ) {
      edges {
        node {
          slug
          title
          link
          thumbnail
          acf {
            venue
            eventPrice
            eventDates {
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;
