
# Simple Node.js DNS cache

This is a lightweight DNS cache with configurable TTL.

The cache will increase performance and eliminate [DNS lookup conflicts](https://github.com/joyent/node/issues/7729).

## Installation

```bash
$ npm install dns-cache
```

## Usage

Just require dns-cache on application start.

```javascript
var dnscache = require('dns-cache')(10000);
```

All following DNS look-ups will be cached and re-used automatically.

## Configuration

Takes optional TTL in milliseconds as the only configration argument.
