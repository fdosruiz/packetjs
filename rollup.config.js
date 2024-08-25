/* eslint-disable @typescript-eslint/no-var-requires */
const dts = require('rollup-plugin-dts').default;

module.exports = [{
    input: "src/index.ts",
    output: [{ file: "lib/index.d.ts", format: "es" }],
    plugins: [dts()],
}];
