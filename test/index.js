/**
 * Unit test
 *
 * @author devswede@gmail.se (Reine Olofsson)
 */

(function(exports, module) {
  'use strict';

  var assert = require('assert'),
      dns = require('dns'),
      dnscache,
      testUri = 'www.google.com',
      invalidUri = 'wwww.google.comerror';

  dnscache = require('../index.js')(10000);

  dns.lookup(testUri, {family:4}, function (err, address, family) {

    if (err) {
      assert.fail(err.message, '', 'Error performing initial DNS lookup', "equals");
    } else {
      assert.equal(family, 4, 'Expected family to be 4, got ' + family);
      dns.lookup(testUri, {family:4}, function (err2, address2, family) {
        assert.equal(address2, address, 'Got different lookup result using DNS cache');
      });
    }

  });

  dns.lookup(testUri, 4, function (err, address, family) {

    if (err) {
      assert.fail(err.message, '', 'Error performing DNS lookup with family instead of options', "equals");
    } else {
      assert.equal(family, 4, 'Expected family to be 4, got ' + family);
      dns.lookup(testUri, 4, function (err2, address2, family) {
        assert.equal(address2, address, 'Got different lookup with family instead of options');
      });
    }

  });

  dns.lookup(testUri, {family:4, all:true}, function (err, addresses) {

    if (err) {
      assert.fail(err.message, '', 'Error performing DNS lookup with all:true', "equals");
    } else {
      dns.lookup(testUri, {family:4, all:true}, function (err2, addresses2) {
        assert.equal(addresses2.join('-'), addresses.join('-'), 'Got different lookup result using all:true');
      });
    }

  });

  dns.lookup(invalidUri, {family:4, all:true}, function (err, adressess) {

    if (err && err.code === 'ENOTFOUND') {
      assert.equal(err.code, 'ENOTFOUND', 'Expected ENOTFOUND error for invalid hostname');
    } else {
      assert.fail(err, 'Error', 'Error not returned for invalid hostname');
    }

  });

})(exports, module);