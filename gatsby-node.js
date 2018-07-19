const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const moment = require(`moment`);
let day = moment().format('MMMM-YYYY').toLowerCase();

function createPostHelper(createPage, links, template, prefix = "posts"){
  _.each(links, link => {
    createPage({
      path: `/${prefix}/${link.node.slug}/`,
      component: slash(template),
      context: {
        id: link.node.id,
        slug : link.node.slug,
        day : day
      },
    })
  })
}

function createCategoryPageHelper(createPage, links, template){
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
    createPage({
      path: newLink,
      component: slash(template),
      context: {
        slug : obj.node.slug,
        day : day
      }
    })
  });
}

function createPageHelper(createPage, links, template){
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
    createPage({
      path: newLink,
      component: slash(template),
      context: {
        id: obj.node.id,
        slug : obj.node.slug,
        day : day
      }
    });
  });
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(
      `
       {
          allWordpressPage {
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
    )
      .then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        const pageTemplate = path.resolve("./src/templates/page.js");
        createPageHelper(createPage, result.data.allWordpressPage.edges, pageTemplate);
      })
      .then(() => {
        graphql(
          `
            {
             allWordpressWpEvent {
                edges {
                  node {
                    id
                    slug
                    title
                  }
                }
              }
           }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const eventTemplate = path.resolve("./src/templates/event.js");
          createPostHelper(createPage, result.data.allWordpressWpEvent.edges, eventTemplate, "event");
        })
      })
      .then(() => {
        graphql(
          `
          {
             allWordpressCategory{
              edges{
                node {
                  name
                  slug
                  link
                  wordpress_parent
                  wordpress_id
                  parent_element{
                    name
                    slug
                  }
                }
              }
            }
          }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const pageTemplate = path.resolve("./src/templates/category.js");
          createCategoryPageHelper(createPage, result.data.allWordpressCategory.edges, pageTemplate);
        })
      })
      .then(() => {
        graphql(
          `
            {
             allWordpressWpMagazine {
                edges {
                  node {
                    id
                    slug
                    title
                  }
                }
              }
           }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const magazineTemplate = path.resolve("./src/templates/magazine.js");
          createPostHelper(createPage, result.data.allWordpressWpMagazine.edges, magazineTemplate, "magazine");
        })
      })
      .then(() => {
        graphql(
          `
            {
              allWordpressPost {
                edges {
                  node {
                    id
                    slug
                    status
                    template
                    format
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const postTemplate = path.resolve("./src/templates/post.js");
          createPostHelper(createPage, result.data.allWordpressPost.edges, postTemplate);
          resolve()
        })
      })
      .catch(err => {
        console.log(err.message)
        reject(err)
      })
  })
}