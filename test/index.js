/**
 * Unit test
 *
 * @author devswede@gmail.se (Reine Olofsson)
 */

(function(exports, module) {
  'use strict';

  var assert = require('assert'),
      dns = require('dns'),
      testUri = 'www.google.com';

  dns.lookup(testUri, 4, function (err, ip, ipv) {

    if (err) {

      assert.fail(err.message, '', 'Error performing initial DNS lookup', "equals");

    } else {

      var dnscache = require('../index.js');
      dns.lookup(testUri, 4, function (err2, ip2, ipv2) {
        assert.equal(ip2, ip, 'Got different lookup result using DNS cache');
      });

    }

  });

})(exports, module);