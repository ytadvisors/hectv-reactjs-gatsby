const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const moment = require(`moment`);
const fs = require(`fs`);
const util = require('util');

function createPostHelper(createPage, links, template, prefix,
                          categories_index, categories_subindex){
  _.each(links, link => {
    const categories = link.node[categories_index]
      ? categories_subindex
        ? link.node[categories_index].map(obj => obj[categories_subindex])
        : link.node[categories_index]
      : [];
    const postInfo = {
      path: `/${prefix}/${link.node.slug}/`,
      component: slash(template),
      context: {
        id: link.node.id,
        categories : categories,
        slug : link.node.slug
      },
    };

    //console.log("POST INFO: ", postInfo);
    createPage(postInfo);
  })
}

function createCategoryPageHelper(createPage, links, template){
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');

    const categoryInfo = {
      path: newLink,
      component: slash(template),
      context: {
        id: obj.node.id,
        wordpress_id: obj.node.wordpress_id ,
        categories: [ obj.node.wordpress_id ],
        slug : obj.node.slug
      }
    };

    //console.log("CATEGORY INFO: ", categoryInfo);
    createPage(categoryInfo);
  });
}

function createPageHelper(createPage, links){
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
    let templatePath = "./src/templates/page.js";
    switch(obj.node.template){
      case "":
        let filePath = `./src/pages/${obj.node.slug.toLowerCase()}.js`;
        if(fs.existsSync(filePath))
          templatePath = filePath;
        break;
      default:
        templatePath = `./src/templates/${obj.node.template.replace(/\..+/g, "").toLowerCase()}.js`;
    }

    const pageInfo = {
      path: newLink,
      component: slash(path.resolve(templatePath)),
      context: {
        id: obj.node.id,
        slug : obj.node.slug
      }
    };

    //console.log("PAGE INFO: ", pageInfo);
    createPage(pageInfo);

  });
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node : {
      fs : "empty"
    }
  })
};

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
        createPageHelper(createPage, result.data.allWordpressPage.edges);
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
                    event_category
                  }
                }
              }
           }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors);
            reject(result.errors)
          }
          const eventTemplate = path.resolve("./src/templates/event.js");
          createPostHelper(createPage, result.data.allWordpressWpEvent.edges, eventTemplate, "events", "event_category");
        })
      })
      .then(() => {
        graphql(
          `
            {
             allWordpressWpEventCategory {
              edges{
                node{
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
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const eventTemplate = path.resolve("./src/templates/event_type.js");
          createCategoryPageHelper(createPage, result.data.allWordpressWpEventCategory.edges, eventTemplate);
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
                  id
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
                    type
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
          createPostHelper(createPage, result.data.allWordpressWpMagazine.edges, magazineTemplate, "magazine", "type");
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
                    categories{
                      wordpress_id
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
          const postTemplate = path.resolve("./src/templates/post.js");
          createPostHelper(createPage, result.data.allWordpressPost.edges, postTemplate, "posts", "categories", "wordpress_id");
          resolve()
        })
      })
      .catch(err => {
        console.log(err.message)
        reject(err)
      })
  })
}