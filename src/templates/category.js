import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { getPrograms, getExcerpt } from '../utils/helperFunctions';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import CategoryNav from '../components/SubNavigation/CategoryNav';
import ListOfPosts from '../components/ListOfPosts';

export default ({
  data,
  pageContext: { page, edges, numPages = 1 },
  location: { pathname }
}) => {
  const {
    wpCategory = {},
    wpSchedule,
    wpSite: {
      siteMetadata: { siteUrl, fbAppId, googleOauth2ClientId } = {}
    } = {},
    wpMenu
  } = data;

  const { name = '', description = '', link = '', slug = '' } =
    wpCategory || {};
  const [urlPrefix] = pathname.split('page');
  const programs = getPrograms(wpSchedule.edges, 5);

  const pageDescription =
    description || 'On Demand Arts, Culture & Education Programming';
  const pageLink = link.replace(/https?:\/\/[^/]+/, '');

  const posts = edges && edges.map(obj => obj.node);

  let image = '';
  if (posts && posts.length > 0) image = posts[0].thumbnail;
  return (
    <Fragment>
      <SEO
        {...{
          title: `HEC-TV | ${name}`,
          image,
          description: getExcerpt(pageDescription, 320),
          url: siteUrl,
          fbAppId,
          pathname: pageLink,
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
        <CategoryNav slug={slug} />
        <ListOfPosts
          posts={posts || []}
          link={{ page: 'posts' }}
          urlPrefix={urlPrefix}
          numResults={0}
          numPages={numPages}
          currentPage={page}
          design={null}
          loadMore={null}
          resizeRows
        />
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query categoryQuery($slug: String!) {
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
    wpCategory: wordpressCategory(slug: { eq: $slug }) {
      slug
      link
      name
      description
    }
  }
`;
