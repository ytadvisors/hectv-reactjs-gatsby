const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);

function createPostHelper(createPage, links, template, prefix = "posts"){
  _.each(links, link => {
    createPage({
      path: `/${prefix}/${link.node.slug}/`,
      component: slash(template),
      context: {
        id: link.node.id,
        slug : link.node.slug
      },
    })
  })
}

function createPageHelper(createPage, links, template){
  _.each(links, link => {
    console.log("LINK", link);
    const newLink = link.url.replace(/https?:\/\/[^/]+/, '');
    createPage({
      path: newLink,
      component: slash(template),
      context: {
        slug : link.object_slug
      }
    })
    if (link.wordpress_children) {
      createPageHelper(createPage, link.wordpress_children, template)
    }
  });
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(
      `
       {
         allWordpressWpApiMenusMenusItems {
            edges {
              node {
                name
                id
                wordpress_id
                slug
                items{
                  title
                  url
                  wordpress_id
                  object_slug
                  wordpress_children {
                    wordpress_id
                    wordpress_parent
                    title
                    url
                    object_slug
                  }
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
        const pageTemplate = path.resolve("./src/templates/page.js");
        const menus = result.data.allWordpressWpApiMenusMenusItems.edges;
        const header = menus.reduce((result, menu) => menu.node.name === "Header" ? menu.node.items : result);
        const footer = menus.reduce((result, menu) => menu.node.name === "Footer" ? menu.node.items : result);
        createPageHelper(createPage, [ ...header, ...footer ], pageTemplate);
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
          createPostHelper(createPage, result.data.allWordpressWpEvent.edges, eventTemplate, "events");
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
          createPostHelper(createPage, result.data.allWordpressWpMagazine.edges, magazineTemplate, "magazines");
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