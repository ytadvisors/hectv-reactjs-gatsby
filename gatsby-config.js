
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
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        baseUrl: baseUrl,
        protocol: protocol,
        hostingWPCOM: false,
        useACF: false,
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: false,
        concurrentRequests: 10,
        auth: {},
        excludedRoutes: ["/jetpack/**", "/*/*/tags", "/*/*/settings", "/*/*/media", "/*/*/comments", "/*/*/users/*",  "/yoast/**"]
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options : {
        precision: 8
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_TRACKING_ID,
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    }
  ]
};