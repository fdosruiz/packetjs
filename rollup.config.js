/* eslint-disable @typescript-eslint/no-var-requires */
const dts = require('rollup-plugin-dts').default;

/**
 * Transforms bundle outputs by removing code that matches a given regular expression.
 *
 * @param {Object} [options={}] - Options for transforming outputs.
 * @param {RegExp} options.regex - Regular expression to match code that should be removed.
 * @param {Array<string>} options.outputs - List of output filenames to be transformed.
 * @return {Object} - An object with a `generateBundle` method for transforming bundle outputs.
 */
function transformBundleOutputs(options = {}) {
  const { regex, outputs } = options;
  return {
    /**
     * Transforms bundle outputs by removing code that matches a given regular expression.
     *
     * @param {import('rollup').OutputOptions} outputOptions - Options for generating the bundle.
     * @param {import('rollup').OutputBundle} bundle - The generated bundle.
     */
    generateBundle(outputOptions, bundle) {
      if (outputs?.length > 0) {
        outputs.forEach((output) => {
          const file = bundle[output];
          if (file && regex instanceof RegExp) {
            if (file.type === "asset") return;
            file.code = file.code.replace(regex, '');
          }
        });
      }
    },
  };
}

module.exports = [{
  input: "src/index.ts",
  output: [{ file: "lib/index.d.ts", format: "es" }],
  plugins: [
    dts(),
    transformBundleOutputs({
      regex: /\/\*\*\s*\*\s*This file is part of the Packet\.js DI package[^*]*?(\n\s*\*\s[^\n]*?)+\n\s*\*\/\n\n/g,
      outputs: ['index.d.ts'],
    }),
  ],
}];
