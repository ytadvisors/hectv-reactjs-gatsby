import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
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

export default class EventType extends Component {
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
    const {
      data,
      pageContext: { edges, page, numPages = 1 },
      location: { pathname }
    } = this.props;

    const {
      wpSite: {
        siteMetadata: { siteUrl, googleOauth2ClientId, fbAppId } = {}
      } = {},
      wpSchedule,
      wpPage,
      wpEventCategory,
      wpMenu
    } = data;

    const { currentDate } = this.state;
    const programs = getPrograms(wpSchedule.edges, 5);

    if (wpPage.acf) wpPage.acf.content = wpPage.content;

    const events = edges || [];
    const currentEvents = getCurrentEvents(currentDate, events);
    const posts =
      currentEvents &&
      currentEvents.values &&
      currentEvents.values.map(obj => obj.node);

    const [urlPrefix] = pathname.split('page');
    const description =
      wpPage.content || 'On Demand Arts, Culture & Education Programming';
    const selectTitle =
      (wpEventCategory && wpEventCategory.name) || 'Filter Events';

    return (
      <Fragment>
        <SEO
          {...{
            title: `HEC-TV | ${wpPage.title}`,
            image: getFirstImageFromWpList(posts),
            description: getExcerpt(description, 320),
            url: siteUrl,
            fbAppId,
            pathname: wpPage.link.replace(/https?:\/\/[^/]+/, ''),
            siteName: 'hecmedia.org',
            author: 'hectv',
            twitterHandle: '@hec_tv'
          }}
        />
        <Layout
          slug={wpPage.slug}
          menus={wpMenu.edges}
          programs={programs}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
          <div className="col-md-12">
            <EventNav
              {...wpPage}
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
            design={wpPage.acf}
            loadMore={null}
            resizeRows
          />
        </Layout>
      </Fragment>
    );
  }
}

export const query = graphql`
  query eventTypeQuery($wordpress_id: Int) {
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
