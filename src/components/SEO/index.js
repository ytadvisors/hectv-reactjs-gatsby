import React from 'react';
import Helmet from 'react-helmet';
import midSizedFavicon from "./../../assets/favicons/favicon-32x32.png"
import smallFavicon from "./../../assets/favicons/favicon-16x16.png"

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

  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href={midSizedFavicon} />
  <link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
</Helmet>