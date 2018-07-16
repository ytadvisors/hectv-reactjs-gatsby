import React from 'react';
import { Helmet } from 'react-helmet';
import midSizedFavicon from "./../../assets/favicons/favicon-32x32.png"
import smallFavicon from "./../../assets/favicons/favicon-16x16.png"
import appleFavicon from "./../../assets/favicons/apple-touch-icon.png"
import safariFavicon from "./../../assets/favicons/safari-pinned-tab.svg"

export default ({
      description,
      image,
      title,
      site_name,
      author,
      pathname,
      twitter_handle,
      url
                }) => <Helmet
  meta={[
    {
      name: 'description',
      content: description || ''
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0'
    },
    {
      property: 'og:image',
      content: image || ''
    },
    { property: 'og:title', content: title || '' },
    {
      property: 'og:description',
      content: description || ''
    },
    { property: 'og:image:width', content: '650' },
    { property: 'og:image:height', content: '497' },
    { property: 'og:site_name', content: site_name || '' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:url', content: `${url}${pathname}` },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:type', content: 'article' },
    { name: 'author', content: author || '' },
    { name: 'twitter:title', content: title || '' },
    {
      name: 'twitter:description',
      content: description || ''
    },
    { name: 'twitter:site', content: site_name },
    {
      name: 'twitter:image',
      content: image || ''
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: twitter_handle },
    { name : 'msapplication-TileColor', content: "#da532c"},
    { name : 'theme-color', content: "#ffffff"}
  ]}
  link={[
    { rel: 'icon', type:"image/png", sizes : "16x16", href : smallFavicon },
    { rel: 'icon', type:"image/png", sizes : "32x32", href : midSizedFavicon },
    { rel: 'apple-touch-icon', type:"image/png", sizes : "180x180", href : appleFavicon },
    { rel: 'mask-icon', color : "#5bbad5", href : safariFavicon },
  ]}
  title={title}
>