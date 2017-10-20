
# Simple Node.js DNS cache

This is a lightweight DNS cache with configurable TTL.

The cache will increase performance and eliminate [DNS lookup conflicts](https://github.com/joyent/node/issues/7729).

## Installation

```bash
$ npm install dns-cache
```

## Compatibility

For Node.js 0.10 and older, user dns-cache version 1.0.0.

Dns-cache 2.0.0 is not backwards compatible with the 
changes introduced to dns.lookup in Node.js version 0.12.

## Usage

Just require dns-cache on application start.

```javascript
var dnscache = require('dns-cache')(10000);
```

All following DNS look-ups will be cached and re-used automatically.

## Configuration

Takes optional TTL in milliseconds as the only configration argument.
