/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./config');
const { default: packetJsDi } = require('../lib/index.js');

// Add markdown-include to container
const key = 'markdown-include';
packetJsDi.add(key, () => require('markdown-include'));

// Add middleware to intercept processFile
packetJsDi.middleware.add(key, (next, context, args) => {
  const [file] = args;
  const result = next(args);

  if (context.methodName === 'processFile') {
    const build = context.container.get(key).build;
    switch (file) {
      case config.processTitles.npmjsReadme:
        build[file].parsedData = build[file].parsedData.replace(/^## /gm, '### '); // h2 to h3
        build[file].parsedData = build[file].parsedData.replace(/\n# /, '\n## '); // second h1 to h2
        break;
      case config.processTitles.wikiHome:
        // build[file].parsedData = build[file].parsedData.replace(/^## /gm, '### '); // h2 to h3
        break;
      default:
        break;
    }
  }

  if (context.methodName === 'writeFile') {
    console.log(`
      - ${context.container.get(key).options.build}
        have been built successfully from entry point:
        > ${context.container.get(key).options.files}
    `);
  }
  return result;
});

const markdownInclude = packetJsDi.get(key);

const originalProcessFile = markdownInclude.processFile;
const originalWriteFile = markdownInclude.writeFile;

// Override functions to allow middleware interception
markdownInclude.processFile = (path) => originalProcessFile.call(this, path);
markdownInclude.writeFile = (path) => originalWriteFile.call(this, path);

config.compileFiles.forEach((file) => {
  markdownInclude.compileFiles(`${config.compileBasePath}${file}`);
});
