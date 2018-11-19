import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';

import { loadLiveVideosAction } from '../store/actions/postActions';
import { sendContactEmail } from '../store/actions/accountActions';
import { openOverlayAction } from '../store/actions/pageActions';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';
import Map from '../components/Map';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import Template3 from '../components/Templates/template-3/index';

class Template3Page extends Component {
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

  getSuccessMsg = () => (
    <div
      className="text-center"
      style={{
        padding: '1.2em 3em 2.8em',
        lineHeight: '2em',
        background: '#ddecff'
      }}
    >
      <div>
        <p>
          <b>Congratulations!</b>{' '}
        </p>
        <p>Your contact message has been sent.</p>
      </div>
    </div>
  );

  contactUs = () => {
    const {
      pageForm: { contact: { values } = {} } = {},
      dispatch
    } = this.props;
    const newValues = { ...values };
    delete newValues['contact-captcha'];
    dispatch(sendContactEmail(newValues));
    dispatch(openOverlayAction('basic', { content: this.getSuccessMsg() }));
  };

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
    const {
      data: {
        wpPage: { title, content, acf = {}, link = '', slug } = {},
        wpSite: { siteMetadata: { siteUrl, fbAppId, mapKey } = {} } = {}
      },
      liveVideos
    } = this.props;

    const { programs } = this.state;
    const pageContent = { ...acf };
    pageContent.content = content;

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
            <Template3 {...{ pageContent }} callbackFunc={this.contactUs}>
              <Map mapKey={mapKey} />
            </Template3>
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pageForm: state.form,
  liveVideos: state.postReducers.liveVideos
});

export default connect(mapStateToProps)(Template3Page);
export const query = graphql`
  query template3PageQuery($slug: String!) {
    wpSite: site {
      siteMetadata {
        siteUrl
        mapKey
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
      acf {
        address
        phoneNumber
        faxNumber
        directions
        opportunities
        tvProviders {
          provider
          channel
        }
        team {
          name
          position
          email
        }
      }
    }
  }
`;
