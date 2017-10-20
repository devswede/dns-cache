/**
 * DNS lookup cache
 *
 * Eliminate dns lookup conflicts according to: https://github.com/joyent/node/issues/7729
 * @author devswede@gmail.se (Reine Olofsson)
 * @return {object} Expose public accessible methods.
 */

(function(exports, module) {
  'use strict';

  var dns = require('dns'),
      cacheTtl = 5000,
      dnsCache = {};

  module.exports = function(ttl) {

    cacheTtl = ttl || cacheTtl;

    /***
     * Add cache support on top of default dns.lookup functionality
     */
    dns._lookup = dns.lookup;

    /***
     * Extend dns.lookup functionality
     */
    dns.lookup = function(hostname, options, callback) {
      let key = hostname,
          ip;

      if (!callback) {
        callback = options;
        options = undefined;
      } else if (typeof options === 'object') {
        key = key + (options.family || '-') + (options.hints || '-') + (options.all || '-');
      } else if (options) {
        key = key + options;
      }

      ip = dnsCache[key];
      if (ip && ip.ttl >= Date.now()) {

        // Return cached ip address
        return process.nextTick(function() {
          callback.apply(null, ip.arguments);
        });

      } else {

        if (ip) {
          dnsCache[key].ttl = Date.now() + cacheTtl;
        }

        // Perform default lookup and cache result
        dns._lookup(hostname, options, function(err, address, family) {
          if (!err) {
            //Do not cache unsuccessful look-ups
            dnsCache[key] = {arguments: arguments, ttl: (Date.now() + cacheTtl)};
          }
          callback.apply(null, arguments);
        });

      }
    };
  }

})(exports, module);
