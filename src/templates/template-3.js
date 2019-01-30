import React, { Component, Fragment } from 'react';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { sendContactEmail } from '../store/actions/accountActions';
import { openOverlayAction } from '../store/actions/pageActions';

import { getPrograms, getExcerpt } from '../utils/helperFunctions';
import Map from '../components/Map';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import DefaultNav from '../components/SubNavigation/DefaultNav';
import Template3 from '../components/Templates/template-3/index';

class Template3Page extends Component {
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

  render() {
    const {
      data: {
        wpPage: { title, content, acf = {}, link = '', slug } = {},
        wpSite: {
          siteMetadata: { siteUrl, fbAppId, mapKey, googleOauth2ClientId } = {}
        } = {},
        wpSchedule: { edges } = {},
        wpMenu
      }
    } = this.props;

    const programs = getPrograms(edges, 5);
    const pageContent = { ...acf };
    pageContent.content = content;

    const description =
      content || 'On Demand Arts, Culture & Education Programming';
    return (
      <Fragment>
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
        <Layout
          slug={slug}
          menus={wpMenu.edges}
          programs={programs}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
        >
          <div className="col-md-12">
            <DefaultNav title={title} link={link} />
          </div>
          <Template3 {...{ pageContent }} callbackFunc={this.contactUs}>
            <Map mapKey={mapKey} />
          </Template3>
        </Layout>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  pageForm: state.form
});

export default connect(mapStateToProps)(Template3Page);

export const query = graphql`
  query template3PageQuery($slug: String!) {
    wpSite: site {
      siteMetadata {
        siteUrl
        mapKey
        fbAppId
        googleOauth2ClientId
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
