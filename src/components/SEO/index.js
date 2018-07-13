import React from 'react';
import Helmet from 'react-helmet';

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
          { name: 'twitter:creator', content: twitter_handle }
        ]}
        title={title}
      />