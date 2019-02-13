import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
import _ from 'lodash';
import moment from 'moment';

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

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(moment().format('MM/DD/YYYY'))
    };
  }

  changeDate = newDate => {
    this.setState({ currentDate: moment(newDate) });
  };

  render() {
    const { data } = this.props;
    const { currentDate } = this.state;
    const {
      wpSchedule,
      wpSite: { siteMetadata: { siteUrl, fbAppId, googleOauth2ClientId } = {} }
    } = data;

    const programs = getPrograms(wpSchedule.edges, 5);

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
      <Fragment>
        <SEO
          {...{
            title: `HEC-TV | ${data.wpPage.title}`,
            image: getFirstImageFromWpList(posts),
            description: getExcerpt(description, 320),
            url: siteUrl,
            fbAppId,
            pathname: data.wpPage.link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          slug={data.wpPage.slug}
          menus={data.wpMenu.edges}
          programs={programs}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
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
        </Layout>
      </Fragment>
    );
  }
}

export const query = graphql`
  query eventPageQuery {
    wpSite: site {
      siteMetadata {
        siteUrl
        fbAppId
        googleOauth2ClientId
      }
    }
    wpMenu: allWordpressWpApiMenusMenusItems {
      edges {
        node {
          name
          count
          items {
            title
            url
            wordpress_children {
              wordpress_id
              wordpress_parent
              title
              url
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
