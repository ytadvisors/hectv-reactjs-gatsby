const _ = require(`lodash`);
const deepMapKeys = require('deep-map-keys');

let activeEnv = process.env.ACTIVE_ENV;
let baseUrl = '';
let protocol = '';

if (!activeEnv) {
  activeEnv = 'development';
}

require('dotenv').config({
  path: `.env.${activeEnv}`,
  silent: true
});

if (process.env.GATSBY_WP_HOST) {
  [protocol, baseUrl] = process.env.GATSBY_WP_HOST.split('://');
}

const snakeToCamel = key => {
  const keyMap = key.split('_');
  switch (keyMap[0]) {
    case '':
    case 'wordpress':
    case 'acf':
    case 'WordPressAcf':
      break;
    default:
      if (keyMap[keyMap.length - 1] !== 'NODE') return _.camelCase(key);
  }
  return key;
};

module.exports = {
  siteMetadata: {
    title: 'HEC-TV | Home',
    description: 'On Demand Arts, Culture & Education Programming',
    siteUrl: process.env.GATSBY_SITE_HOST,
    mapKey: process.env.GOOGLE_API_KEY,
    captchaKey: process.env.RE_CAPTCHA_SITE_KEY,
    apiUrl: process.env.GATSBY_WP_HOST,
    fbAppId: process.env.FACEBOOK_APP_ID
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        baseUrl,
        protocol,
        hostingWPCOM: false,
        useACF: true,
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: true,
        perPage: 100,
        concurrentRequests: 40,
        auth: {
          jwt_token: ''
        },
        excludedRoutes: [
          '/jetpack/**',
          '/*/*/tags',
          '/*/*/settings',
          '/*/*/media',
          '/*/*/users',
          '/*/*/users/*',
          '/yoast/**'
        ],
        normalizer({ entities }) {
          return deepMapKeys(entities, snakeToCamel);
        }
      }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Quicksand`,
          `Muli`,
          `source sans pro:300,400,400i,700` // you can also specify font weights and styles
        ]
      }
    },
    {
      resolve: `gatsby-plugin-mailchimp`,
      options: {
        endpoint:
          'https://hectv.us17.list-manage.com/subscribe/post?u=3ba5cb3441b0c6df467d5c65b&amp;id=c4ddedb2ea'
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        setup: ({
          query: {
            site: { siteMetadata },
            ...rest
          }
        }) => ({
          ...siteMetadata,
          ...rest,
          custom_namespaces: {
            webfeeds: 'http://webfeeds.org/rss/1.0'
          },
          custom_elements: [
            {
              'webfeeds:analytics': {
                _attr: {
                  id: process.env.GA_TRACKING_ID,
                  engine: 'GoogleAnalytics'
                }
              }
            },
            {
              'webfeeds:related': {
                _attr: {
                  layout: 'card',
                  target: 'browser'
                }
              }
            },
            {
              'webfeeds:icon': `${
                process.env.GATSBY_SITE_HOST
              }/favicons/favicon-32x32.png`
            },
            {
              'webfeeds:logo': `${
                process.env.GATSBY_SITE_HOST
              }/favicons/favicon-32x32.png`
            },
            { 'webfeeds:accentColor': '00FF00' }
          ]
        }),
        feeds: [
          {
            serialize: ({
              query: {
                site: { siteMetadata: { siteUrl } = {} },
                allWordpressPost: { edges } = {}
              }
            }) =>
              edges.map(
                ({ node: { excerpt, date, title, slug, content } = {} }) => ({
                  description: excerpt,
                  date,
                  title,
                  url: `${siteUrl}/posts/${slug}`,
                  guid: `${siteUrl}/posts/${slug}`,
                  custom_elements: [
                    {
                      'content:encoded': content
                    }
                  ]
                })
              ),
            query: `
            {
              allWordpressPost(
                limit: 1000
                sort: { order:DESC, fields: [ date ]}
              ) {
                edges {
                  node {
                    date
                    slug
                    excerpt
                    title
                    content
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: 'HEC RSS Feed'
          }
        ]
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
        gtmPreview: process.env.GA_TAGMANAGER_ENV_PREVIEW_NAME
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: process.env.GATSBY_SITE_HOST,
        sitemap: `${process.env.GATSBY_SITE_HOST}/sitemap.xml`,
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
