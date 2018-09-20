const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const moment = require(`moment`);
const fs = require(`fs`);
const util = require('util');

function createPostHelper(createPage, params, links, template, prefix,
                          categories_index, categories_subindex){
  const { live_videos } = params;
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
        live_videos: live_videos,
        id: link.node.id,
        categories : categories,
        slug : link.node.slug
      },
    };

    //console.log("POST INFO: ", postInfo);
    createPage(postInfo);
  })
}

function createCategoryPageHelper(createPage, params, links, template){
  const { live_videos } = params;
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');

    const categoryInfo = {
      path: newLink,
      component: slash(template),
      context: {
        live_videos: live_videos,
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

function createPageHelper(createPage, params, links){
  const { live_videos } = params;
  _.each(links, obj => {
    const newLink = obj.node.link.replace(/https?:\/\/[^/]+/, '');
    let templatePath = "./src/templates/page.js";
    let slug = obj.node.slug.toLowerCase();
    if(!slug)
      slug = "home";

    switch(obj.node.template){
      case "":
        let filePath = `./src/templates/${slug}.js`;
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
        live_videos: live_videos,
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

exports.createPages = ({ graphql, actions, page }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(
      `
       {
        allWordpressWpLivevideos{
          edges{
            node{
              link
              title
              wordpress_id
              acf{
                start_date
                end_date
                url
              }
            }
          }
        }
      }
    `
    )
    .then(result => new Promise((resolve, reject) => {
      let air_times = [];
      if (!result.errors) {
        const air_times = result.data.allWordpressWpLivevideos.edges.map(obj =>
          obj.node.acf.start_date && ({
            link : obj.node.link,
            title : obj.node.title,
            url : obj.node.acf.url,
            id : obj.node.wordpress_id,
            start_date: obj.node.acf.start_date,
            end_date: obj.node.acf.end_date
          })
        ).filter(n=>n);

        console.log("AIR TIMES", air_times);
      }
      resolve({live_videos: air_times});
    }))

    .then(params => new Promise((resolve, reject) => {
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
            console.log(result.errors);
            reject(result.errors)
          }
          createPageHelper(createPage, params, result.data.allWordpressPage.edges);
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING")
          console.log(err.message);
          reject(err)
        })
    }))

    .then(params => new Promise((resolve, reject) => {
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
      )
        .then(result => {
          if (result.errors) {
            console.log(result.errors);
            reject(result.errors)
          }
          const eventTemplate = path.resolve("./src/templates/event.js");
          createPostHelper(createPage, params, result.data.allWordpressWpEvent.edges, eventTemplate, "events", "event_category");
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING")
          console.log(err.message);
          reject(err)
        })
    }))
    .then(params => new Promise((resolve, reject) => {
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
      )
        .then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const eventTemplate = path.resolve("./src/templates/event_type.js");
          createCategoryPageHelper(createPage, params, result.data.allWordpressWpEventCategory.edges, eventTemplate);
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING");
          console.log(err.message);
          reject(err)
        })
    }))
    .then(params => new Promise((resolve, reject) => {
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
      )
        .then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const pageTemplate = path.resolve("./src/templates/category.js");
          createCategoryPageHelper(createPage, params, result.data.allWordpressCategory.edges, pageTemplate);
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING");
          console.log(err.message);
          reject(err)
        })
    }))
    .then(params => new Promise((resolve, reject) => {
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
      )
        .then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const magazineTemplate = path.resolve("./src/templates/magazine.js");
          createPostHelper(createPage, params, result.data.allWordpressWpMagazine.edges, magazineTemplate, "magazine", "type");
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING");
          console.log(err.message);
          reject(err)
        })
    }))
    .then(params => new Promise((resolve, reject) => {
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
      )
        .then(result => {
          if (result.errors) {
            console.log(result.errors);
            reject(result.errors)
          }
          const postTemplate = path.resolve("./src/templates/post.js");
          createPostHelper(createPage, params, result.data.allWordpressPost.edges, postTemplate, "posts", "categories", "wordpress_id");
          resolve(params);
        })
        .catch(err => {
          console.log("ERRORS PROCESSING");
          console.log(err.message);
          reject(err)
        })
    }))
    .then(params => new Promise((resolve, reject) => {
      try{
        const searchInfo = {
          path: "/search/:path",
          component: slash(path.resolve("./src/templates/search.js")),
          context: {}
        };
        createPage(searchInfo);
      } catch(err){
        console.log("ERROR WITH THE SEARCH", err)
      }

      resolve(params);
    }))
    .then(() => resolve())
    .catch(err => {
      console.log("ERRORS PROCESSING");
      console.log(err.message);
      reject(err)
    })
  })
}