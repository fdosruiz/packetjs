/* eslint-disable @typescript-eslint/no-var-requires */
const { default: packetJsDi } = require('../lib/index.js');
const { MARKDOWN_INCLUDE } = require("./config/keys");

// Add middleware to intercept markdownInclude
packetJsDi.middleware.add(MARKDOWN_INCLUDE, (next, context, args) => {
  const props = context.container.getProps();
  const [file] = args;
  const result = next(args);

  if (context.methodName === 'processFile') {
    const build = context.container.get(MARKDOWN_INCLUDE).build;
    switch (file) {
      case props.processTitles.wikiHome:
        // build[file].parsedData = build[file].parsedData.replace(/^## /gm, '### '); // h2 to h3
        break;
      default:
        break;
    }
  }

  if (context.methodName === 'writeFile') {
    console.log(`
      - ${context.container.get(MARKDOWN_INCLUDE).options.build}
        have been built successfully from entry point:
        > ${context.container.get(MARKDOWN_INCLUDE).options.files}
    `);
  }
  return result;
});

// Get markdownInclude
const markdownInclude = packetJsDi.get(MARKDOWN_INCLUDE);

// Get original functions
const originalProcessFile = markdownInclude.processFile;
const originalWriteFile = markdownInclude.writeFile;

// Override functions to allow middleware interception
markdownInclude.processFile = (path) => originalProcessFile.call(this, path);
markdownInclude.writeFile = (path) => originalWriteFile.call(this, path);
