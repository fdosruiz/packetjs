/* eslint-disable @typescript-eslint/no-var-requires */
const { default: packetJsDi } = require('../lib/index.js');
const { MARKDOWN_INCLUDE } = require("./config/keys");
require('./container');
require('./middleware');

const props = packetJsDi.getProps();

props.filesToProcess.forEach((file) => {
  packetJsDi.get(MARKDOWN_INCLUDE).compileFiles(`${props.compileBasePath}${file}`);
});
