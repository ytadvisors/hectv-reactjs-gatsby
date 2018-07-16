import React from 'react';
import { Helmet } from 'react-helmet';
import midSizedFavicon from "./../../assets/favicons/favicon-32x32.png";
import smallFavicon from "./../../assets/favicons/favicon-16x16.png";
import safariFavicon from "./../../assets/favicons/safari-pinned-tab.svg";
import appleFavicon_57 from "./../../assets/favicons/apple-icon-57x57.png";
import appleFavicon_60 from "./../../assets/favicons/apple-icon-60x60.png";
import appleFavicon_72 from "./../../assets/favicons/apple-icon-72x72.png";
import appleFavicon_76 from "./../../assets/favicons/apple-icon-76x76.png";
import appleFavicon_114 from "./../../assets/favicons/apple-icon-114x114.png";
import appleFavicon_120 from "./../../assets/favicons/apple-icon-120x120.png";
import appleFavicon_144 from "./../../assets/favicons/apple-icon-144x144.png";
import appleFavicon_152 from "./../../assets/favicons/apple-icon-152x152.png";
import appleFavicon_180 from "./../../assets/favicons/apple-icon-180x180.png";

import androidFavicon_190 from "./../../assets/favicons/android-icon-192x192.png";
import favicon_32 from "./../../assets/favicons/favicon-32x32.png";
import favicon_96 from "./../../assets/favicons/favicon-96x96.png";
import favicon_16 from "./../../assets/favicons/favicon-16x16.png";
import msFavicon_144 from "./../../assets/favicons/ms-icon-144x144.png";

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

  <link rel="apple-touch-icon" sizes="57x57" href={appleFavicon_57} />
  <link rel="apple-touch-icon" sizes="60x60" href={appleFavicon_60} />
  <link rel="apple-touch-icon" sizes="72x72" href={appleFavicon_72} />
  <link rel="apple-touch-icon" sizes="76x76" href={appleFavicon_76} />
  <link rel="apple-touch-icon" sizes="114x114" href={appleFavicon_114} />
  <link rel="apple-touch-icon" sizes="120x120" href={appleFavicon_120} />
  <link rel="apple-touch-icon" sizes="144x144" href={appleFavicon_144} />
  <link rel="apple-touch-icon" sizes="152x152" href={appleFavicon_152} />
  <link rel="apple-touch-icon" sizes="180x180" href={appleFavicon_180} />
  <link rel="icon" type="image/png" sizes="192x192"  href={androidFavicon_190} />
  <link rel="icon" type="image/png" sizes="32x32" href={favicon_32} />
  <link rel="icon" type="image/png" sizes="96x96" href={favicon_96} />
  <link rel="icon" type="image/png" sizes="16x16" href={favicon_16} />
  <meta name="msapplication-TileColor" content="#ffffff" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="msapplication-TileImage" content={msFavicon_144} />
</Helmet>