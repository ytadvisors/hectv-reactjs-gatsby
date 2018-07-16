let activeEnv = process.env.ACTIVE_ENV;
let baseUrl = "";
let protocol = "";

if (!activeEnv) {
  activeEnv = "development";
}

require("dotenv").config({
  path: `.env.${activeEnv}`,
});

if(process.env.WP_HOST){
  [ protocol, baseUrl ] = process.env.WP_HOST.split("://");
}

module.exports = {
  siteMetadata: {
    title: 'HEC-TV | Home',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'HEC-TV',
        short_name: 'HEC-TV',
        description: 'On Demand Arts, Culture & Education Programming',
        homepage_url: 'https://hectv.org',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'src/assets/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'src/assets/favicons/android-chrome-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
        ],
      },
    },
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