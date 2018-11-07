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
  _.each(links, link => {
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
        slug: link.node.slug,
        env: process.env
      }
    };

    // console.log("POST INFO: ", util.inspect(postInfo, true, 5));
    createPage(postInfo);
  });
}

function createCategoryPageHelper(createPage, links, template) {
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');

    const categoryInfo = {
      path: newLink,
      component: slash(template),
      context: {
        id: obj.node.id,
        wordpress_id: obj.node.wordpress_id,
        categories: [obj.node.wordpress_id],
        slug: obj.node.slug,
        env: process.env
      }
    };

    // console.log("CATEGORY INFO: ", util.inspect(categoryInfo, true, 5));
    createPage(categoryInfo);
  });
}

function createPageHelper(createPage, links) {
  _.each(links, obj => {
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
        slug: obj.node.slug,
        env: process.env
      }
    };

    // console.log("PAGE INFO: ", util.inspect(pageInfo, true, 5));
    createPage(pageInfo);
  });
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  });
};

async function createSitePages(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpPages: allWordpressPage {
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

  return createPageHelper(createPage, result.data.wpPages.edges);
}

async function createSiteEvents(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpEvents: allWordpressWpEvent {
          edges {
            node {
              id
              slug
              title
              event_category
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
    result.data.wpEvents.edges,
    eventTemplate,
    'events',
    'event_category'
  );
}

async function createSiteEventCategories(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpEventCategories: allWordpressWpEventCategory {
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
    result.data.wpEventCategories.edges,
    eventTemplate
  );
}

async function createSiteCategories(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpCategory: allWordpressCategory {
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
  return createCategoryPageHelper(
    createPage,
    result.data.wpCategory.edges,
    pageTemplate
  );
}

async function createSiteMagazines(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpMagazine: allWordpressWpMagazine {
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
    result.data.wpMagazine.edges,
    magazineTemplate,
    'magazine',
    'type'
  );
}

async function createSitePosts(createPage, graphql) {
  const result = await graphql(
    `
      {
        wpPosts: allWordpressPost {
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
    result.data.wpPosts.edges,
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

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  try {
    await Promise.all([
      createSearch(createPage),
      createSitePages(createPage, graphql),
      createSiteEvents(createPage, graphql),
      createSiteEventCategories(createPage, graphql),
      createSiteCategories(createPage, graphql),
      createSiteMagazines(createPage, graphql),
      createSitePosts(createPage, graphql)
    ]);
    return new Promise(resolve => resolve(true));
  } catch (err) {
    console.log('ERRORS PROCESSING');
    console.log(err.message);
    return new Promise((resolve, reject) => reject(err.message));
  }
};
