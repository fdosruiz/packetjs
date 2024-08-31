/* eslint-disable @typescript-eslint/no-var-requires */
const { default: packetJsDi } = require('../lib/index.js');
const { MARKDOWN_INCLUDE } = require("./config/keys");
const config = require('./config');

packetJsDi.addProps(config);
packetJsDi.add(MARKDOWN_INCLUDE, () => require('markdown-include'));
