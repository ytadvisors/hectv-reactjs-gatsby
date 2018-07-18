import React from 'react';
import { Helmet } from 'react-helmet';


export default ({
                  description,
                  image,
                  title,
                  site_name,
                  author,
                  pathname,
                  twitter_handle,
                  url
                }) => <Helmet>
  <title>{title}</title>
  <meta name="description" content={description || ''}  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="og:image" content={image || ''}  />
  <meta name="og:title" content={title || ''}  />
  <meta name="og:image:width" content="650"  />
  <meta name="og:image:height" content="497"  />
  <meta name="og:site_name" content={site_name || ''}  />
  <meta name="og:locale'" content="en_US"  />
  <meta name="og:url" content={`${url}${pathname}`}  />
  <meta name="og:type" content='article'  />

  <meta name="twitter:image" content={image || ''}  />
  <meta name="twitter:title" content={title || ''}  />
  <meta name="twitter:description" content={description || ''}  />
  <meta name="twitter:card" content="summary_large_image"  />
  <meta name="twitter:creator" content={twitter_handle || ''}  />

  <link rel="apple-touch-icon" sizes="57x57" href={("/favicons/apple-icon-57x57.png")} />
  <link rel="apple-touch-icon" sizes="60x60" href={("/favicons/apple-icon-60x60.png")} />
  <link rel="apple-touch-icon" sizes="72x72" href={("/favicons/apple-icon-72x72.png")} />
  <link rel="apple-touch-icon" sizes="76x76" href={("/favicons/apple-icon-76x76.png")} />
  <link rel="apple-touch-icon" sizes="114x114" href={("/favicons/apple-icon-114x114.png")} />
  <link rel="apple-touch-icon" sizes="120x120" href={("/favicons/apple-icon-120x120.png")} />
  <link rel="apple-touch-icon" sizes="144x144" href={("/favicons/apple-icon-144x144.png")} />
  <link rel="apple-touch-icon" sizes="152x152" href={("/favicons/apple-icon-152x152.png")} />
  <link rel="apple-touch-icon" sizes="180x180" href={("/favicons/apple-icon-180x180.png")} />
  <link rel="icon" type="image/png" sizes="192x192"  href={("/favicons/android-icon-192x192.png")} />
  <link rel="icon" type="image/png" sizes="32x32" href={("/favicons/favicon-32x32.png")} />
  <link rel="icon" type="image/png" sizes="96x96" href={("/favicons/favicon-96x96.png")} />
  <link rel="icon" type="image/png" sizes="16x16" href={("/favicons/favicon-16x16.png")} />
  <link rel="shortcut icon" href={("/favicons/favicon.ico")} />
  <meta name="msapplication-TileColor" content="#ffffff" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="msapplication-TileImage" content={("/favicons/ms-icon-144x144.png")} />
</Helmet>