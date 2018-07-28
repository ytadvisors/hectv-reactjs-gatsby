exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  // Redirect some popular search results to their new pages
  const redirects = [
    { test: /^\/blog\/(.+)\/?$/g, targetURI: '/posts/$1' },
    { test: /^\/events\/genres\/(.+)?$/g, targetURI: '/event_category/$1/' },
    { test: /^\/watch\/topic\/(.+)?$/g, targetURI: '/search/$1/' },
    { test: /^\/watch\/(.+)\/(.+)?$/g, targetURI: '/posts/$2/' },
    { test: /^\/watch\/(.+)\/(.+)\/(.+)?$/g, targetURI: '/posts/$2/' },
    { test: /^\/blog\/?$/g, targetURI: '/' },
    { test: /^\/category\/(.+)?$/g, targetURI: '/' }
  ];

  const redirect = redirects.find(r => uri.match(r.test));
  if (redirect) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://hectv.org' + redirect.targetURI
          }
        ]
      }
    };

    callback(null, response);
    return;
  }

  callback(null, request);
};