const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const fs = require(`fs`);
// const util = require('util');

let activeEnv = process.env.ACTIVE_ENV;
if (!activeEnv) {
  activeEnv = 'development';
}

require('dotenv').config({
  path: `.env.${activeEnv}`,
  silent: true
});

function createPostHelper(
  createPage,
  links,
  template,
  prefix,
  categoriesIndex,
  categoriesSubindex
) {
  links.forEach(link => {
    let categories = [];
    if (link.node[categoriesIndex]) {
      if (categoriesSubindex) {
        categories = link.node[categoriesIndex].map(
          obj => obj[categoriesSubindex]
        );
      } else {
        categories = link.node[categoriesIndex];
      }
    }

    const postInfo = {
      path: `/${prefix}/${link.node.slug}/`,
      component: slash(template),
      context: {
        id: link.node.id,
        categories,
        slug: link.node.slug
      }
    };

    // console.log("POST INFO: ", util.inspect(postInfo, true, 5));
    createPage(postInfo);
  });
}

async function getCategoryGraphQl(graphql, slug) {
  return graphql(`
      {
        siteCategory: allWordpressPost(
          filter: { categories : { elemMatch : {
            slug: { eq : "${slug}" }
          }}} 
        ) {
          edges {
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
              acf {
                isVideo
              }
            }
          }  
        }
      }
    `);
}

async function getEventCategoryGraphQl(graphql, slug, categories) {
  return graphql(`
      {
        siteCategory: allWordpressWpEvent(
          filter: { eventCategory: { in: ${categories} } }
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
    `);
}

async function createCategoryPageHelper(
  createPage,
  graphql,
  categoryFunc,
  perPage,
  links,
  template
) {
  links.forEach(async obj => {
    try {
      const response = await categoryFunc(graphql, obj.node.slug, [
        obj.node.wordpress_id
      ]);
      const { data: { siteCategory = {} } = {} } = response;
      const { edges = [] } = siteCategory || {};
      const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
      if (newLink) {
        const categoryInfo = {
          path: newLink,
          component: slash(template),
          context: {
            id: obj.node.id,
            wordpress_id: obj.node.wordpress_id,
            categories: [obj.node.wordpress_id],
            edges,
            page: 1,
            numPages: 1,
            slug: obj.node.slug
          }
        };

        if (edges.length < perPage) {
          return createPage(categoryInfo);
          // console.log("CATEGORY INFO: ", util.inspect(categoryInfo, true, 15));
        }
        const pages = _.chunk(edges, perPage);
        const numPages = _.size(pages);
        return pages.forEach((edge, page) => {
          const currentPage = page + 1;
          const pagePath =
            currentPage > 1
              ? `${newLink.replace(/\/$/, '')}/page/${currentPage}`
              : newLink;
          return createPage({
            path: pagePath,
            component: slash(template),
            context: Object.assign({
              id: obj.node.id,
              wordpress_id: obj.node.wordpress_id,
              categories: [obj.node.wordpress_id],
              edges: edge,
              page: currentPage,
              numPages,
              slug: obj.node.slug
            })
          });
        });
      }
      return new Promise(resolve => resolve(true));
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  });
}

function createPageHelper(createPage, links) {
  links.forEach(obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
    let templatePath = './src/templates/page.js';
    let slug = obj.node.slug.toLowerCase();
    if (!slug) slug = 'home';

    if (obj.node.template === '') {
      const filePath = `./src/templates/${slug}.js`;
      if (fs.existsSync(filePath)) templatePath = filePath;
    } else {
      templatePath = `./src/templates/${obj.node.template
        .replace(/(\..+)/g, '')
        .toLowerCase()}.js`;
    }

    const pageInfo = {
      path: newLink,
      component: slash(path.resolve(templatePath)),
      context: {
        id: obj.node.id,
        slug: obj.node.slug
      }
    };

    // console.log("PAGE INFO: ", util.inspect(pageInfo, true, 5));
    createPage(pageInfo);
  });
}

async function createSitePages(createPage, graphql) {
  const result = await graphql(
    `
      {
        sitePages: allWordpressPage {
          edges {
            node {
              id
              slug
              status
              template
              link
            }
          }
        }
      }
    `
  );

  if (result.errors) throw new Error(result.errors);

  return createPageHelper(createPage, result.data.sitePages.edges);
}

async function createSiteEvents(createPage, graphql) {
  const result = await graphql(
    `
      {
        siteEvents: allWordpressWpEvent {
          edges {
            node {
              id
              slug
              title
              eventCategory
            }
          }
        }
      }
    `
  );
  if (result.errors) throw new Error(result.errors);

  const eventTemplate = path.resolve('./src/templates/event.js');
  return createPostHelper(
    createPage,
    result.data.siteEvents.edges,
    eventTemplate,
    'events',
    'eventCategory'
  );
}

async function createSiteEventCategories(createPage, graphql) {
  const result = await graphql(
    `
      {
        siteEventCategories: allWordpressWpEventCategory {
          edges {
            node {
              wordpress_id
              id
              slug
              name
              link
            }
          }
        }
      }
    `
  );
  if (result.errors) throw new Error(result.errors);

  const eventTemplate = path.resolve('./src/templates/event_type.js');

  return createCategoryPageHelper(
    createPage,
    graphql,
    getEventCategoryGraphQl,
    10000,
    result.data.siteEventCategories.edges,
    eventTemplate
  );
}

async function createSiteCategories(createPage, graphql) {
  const result = await graphql(
    `
      {
        siteCategory: allWordpressCategory {
          edges {
            node {
              name
              slug
              link
              id
              wordpress_parent
              wordpress_id
              parent_element {
                name
                slug
              }
            }
          }
        }
      }
    `
  );
  if (result.errors) throw new Error(result.errors);

  const pageTemplate = path.resolve('./src/templates/category.js');
  createCategoryPageHelper(
    createPage,
    graphql,
    getCategoryGraphQl,
    40,
    result.data.siteCategory.edges,
    pageTemplate
  );

  return result.data.siteCategory && result.data.siteCategory.edges.length > 0
    ? result.data.siteCategory.edges.map(obj => obj.node)
    : [];
}

async function createSiteMagazines(createPage, graphql) {
  const result = await graphql(
    `
      {
        siteMagazine: allWordpressWpMagazine {
          edges {
            node {
              id
              slug
              title
              type
            }
          }
        }
      }
    `
  );
  if (result.errors) throw new Error(result.errors);

  const magazineTemplate = path.resolve('./src/templates/magazine.js');
  return createPostHelper(
    createPage,
    result.data.siteMagazine.edges,
    magazineTemplate,
    'magazine',
    'type'
  );
}

async function createSitePosts(createPage, graphql) {
  const result = await graphql(
    `
      {
        sitePosts: allWordpressPost {
          edges {
            node {
              id
              slug
              status
              template
              format
              categories {
                wordpress_id
              }
            }
          }
        }
      }
    `
  );
  if (result.errors) throw new Error(result.errors);

  const postTemplate = path.resolve('./src/templates/post.js');
  return createPostHelper(
    createPage,
    result.data.sitePosts.edges,
    postTemplate,
    'posts',
    'categories',
    'wordpress_id'
  );
}

async function createSearch(createPage) {
  createPage({
    path: '/search/:searchpath',
    component: slash(path.resolve('./src/templates/search.js')),
    context: {}
  });
}

async function createPostPreview(createPage) {
  createPage({
    path: '/preview/posts/',
    component: slash(path.resolve('./src/templates/preview-posts.js')),
    context: {}
  });
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  try {
    await Promise.all([
      createSitePosts(createPage, graphql),
      createSiteEventCategories(createPage, graphql),
      createSiteCategories(createPage, graphql),
      createSitePages(createPage, graphql),
      createSiteEvents(createPage, graphql),
      createSiteMagazines(createPage, graphql),
      createSearch(createPage),
      createPostPreview(createPage)
    ]);
    return new Promise(resolve => resolve(true));
  } catch (err) {
    console.log('ERRORS PROCESSING');
    console.log(err.message);
    return new Promise((resolve, reject) => reject(err.message));
  }
};
