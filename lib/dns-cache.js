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
    dns.lookup = function(domain, family, done) {
      if (!done) {
        done = family;
        family = null;
      }

      var key = domain + family;
      var ip = dnsCache[key];
      if (ip && ip.ttl >= Date.now()) {

        // Return cached ip address
        return process.nextTick(function() {
          done(null, ip.ip, ip.ipv);
        });

      } else {

        if (ip) {
          dnsCache[key].ttl = Date.now() + cacheTtl;
        }

        // Perform default lookup and cache result
        dns._lookup(domain, family, function(err, ip, ipv) {
          if (err) {
            return done(err);
          }
          dnsCache[key] = {ip: ip, ipv: ipv, ttl: (Date.now() + cacheTtl)};
          done(null, ip, ipv);
        });

      }
    };
  }

})(exports, module);
