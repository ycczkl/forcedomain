'use strict';

const _ = require('lodash');

const rewrite = require('./rewrite');

const redirect = function (protocol, hostHeader, url, method, options) {
  options = _.defaults(options, {
    protocol: undefined,
    type: 'permanent',
    ignore: undefined
  });

  const hostHeaderParts = (hostHeader || '').split(':');
  const hostname = hostHeaderParts[0] || '';
  const port = (hostHeaderParts[1] - 0) || undefined;
  const targetProtocol = options.protocol ? options.protocol : protocol;
  const ignore = options.ignore || []

  if (
    (ignore.includes(method)) ||
    (hostname === 'localhost') ||
    (hostname.startsWith('192.168.')) ||
    (hostname.endsWith('ngrok.io')) ||
    (hostname === '47.97.221.58') ||
    (hostname === options.hostname && port === options.port && protocol === targetProtocol)
  ) {
    return null;
  }

  /* eslint-disable prefer-template */
  const route = `${targetProtocol}://${hostname}${port ? ':' + port : ''}${url}`;
  /* eslint-enable prefer-template */
  const rewrittenRoute = rewrite(route, options);

  return {
    type: options.type,
    url: rewrittenRoute
  };
};

module.exports = redirect;
