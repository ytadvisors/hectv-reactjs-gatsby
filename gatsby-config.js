
let activeEnv = process.env.ACTIVE_ENV;
let baseUrl = "";
let protocol = "";

if (!activeEnv) {
  activeEnv = "development";
}

require("dotenv").config({
  path: `.env.${activeEnv}`,
  silent : true
});

if(process.env.WP_HOST){
  [ protocol, baseUrl ] = process.env.WP_HOST.split("://");
}

module.exports = {
  siteMetadata: {
    title: 'HEC-TV | Home',
    siteUrl: process.env.SITE_HOST,
    mapKey : process.env.GOOGLE_API_KEY,
    captchaKey : process.env.RE_CAPTCHA_SITE_KEY,
    apiUrl : process.env.WP_HOST,
    fbAppId : process.env.FACEBOOK_APP_ID
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-source-wordpress-fork`,
      options: {
        baseUrl: baseUrl,
        protocol: protocol,
        hostingWPCOM: false,
        useACF: false,
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: true,
        concurrentRequests: 40,
        auth: {
          jwt_token : ""
        },
        excludedRoutes: ["/jetpack/**", "/*/*/tags", "/*/*/settings", "/*/*/media", "/*/*/users/*",  "/yoast/**"]
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Quicksand`,
          `Muli`,
          `source sans pro\:300,400,400i,700` // you can also specify font weights and styles
        ]
      }
    },
    {
      resolve : `gatsby-plugin-mailchimp`,
      options : {
        endpoint : "https://hectv.us17.list-manage.com/subscribe/post?u=3ba5cb3441b0c6df467d5c65b&amp;id=c4ddedb2ea"
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options : {
        precision: 8
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: process.env.GA_TAGMANAGER_ID,

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // Specify optional GTM environment details.
        gtmAuth: process.env.GA_TAGMANAGER_ENV_AUTH_STRING,
        gtmPreview: process.env.GA_TAGMANAGER_ENV_PREVIEW_NAME,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: process.env.SITE_HOST,
        sitemap: `${process.env.SITE_HOST}/sitemap.xml`,
        resolveEnv: () => process.env.GATSBY_ENV,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    }
  ]
};