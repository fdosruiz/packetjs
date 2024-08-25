## [2.0.0](https://github.com/fdosruiz/packetjs/compare/v1.4.0...v2.0.0) (2024-08-25)

### ⚠ BREAKING CHANGES

* Commented out the build stage in the CI/CD workflow and the lib artifact download step in the semantic workflow. This reduces unnecessary processing and aligns the workflows with current project requirements.
* Added support for triggering CI/CD on branches prefixed with 'major/'. Additionally, commented out the QA stage and adjusted dependencies to ensure the build and semantic stages can run independently.
* Commented out steps for semantic release and npm publish in the CI/CD workflow to prevent them from running. This change ensures that these stages are skipped, potentially to address issues or modify the release process.

### Features

* disable semantic release and npm publish in CI/CD pipeline ([c14eac7](https://github.com/fdosruiz/packetjs/commit/c14eac7ef368c39365a17b334114e9719fc394f5))
* disable unused steps in CI/CD and semantic workflows ([9b1c8fb](https://github.com/fdosruiz/packetjs/commit/9b1c8fba9bffbead95b5a097f9b876fe998ca743))
* enable CI/CD for major branches and comment out QA stage ([0829b05](https://github.com/fdosruiz/packetjs/commit/0829b0551bf437ff1a934588c102e67d94d2c9ab))

## [1.4.0](https://github.com/fdosruiz/packetjs/compare/v1.3.4...v1.4.0) (2024-08-25)

### Major Features

* refactor type declarations and error handling in Container.ts ([f2061e2](https://github.com/fdosruiz/packetjs/commit/f2061e2f5d68a6983313f039e0cce4fc3dfab5ac))

### Features

* add global options to Container class ([970e1a9](https://github.com/fdosruiz/packetjs/commit/970e1a96e1f12e8a79d900737f53fe47f9ffb2c8))
* add Singleton option when registering a service and refactor instance retrieval logic for context keys [PTJSD-4] ([84fc2cd](https://github.com/fdosruiz/packetjs/commit/84fc2cd60d9c31c8b5abb3c32e9a55bb11fdc77a))
* integrate middleware support and refactor cache mechanism ([4501c48](https://github.com/fdosruiz/packetjs/commit/4501c48e14018fa0dc529456374675300714f3f6))

### Bug Fixes

* correct logging details ([198c4e8](https://github.com/fdosruiz/packetjs/commit/198c4e812824d9f48d79e514ea056b500150ce8c))
* PTJSD-9 remove unused export from ServiceConfigOptions ([143aefe](https://github.com/fdosruiz/packetjs/commit/143aefe0418125135c40f1f2b06112b21b1caa94))
* update deprecation message in ServiceConfigOptions ([1e3c70e](https://github.com/fdosruiz/packetjs/commit/1e3c70e5d8178a019d3ff2318b1e79356823b625))
* update middleware types and methods to improve flexibility ([e9c16cf](https://github.com/fdosruiz/packetjs/commit/e9c16cfd3f56849279df0d9b7a9d4381aba5cc9c))

### Trivial Changes

* add middleware and proxy keywords to package.json ([d63bae7](https://github.com/fdosruiz/packetjs/commit/d63bae7ec5f9de0cf551c8579628813892bf40e0))
* enforce spacing and trailing space rules in ESLint config ([46136f4](https://github.com/fdosruiz/packetjs/commit/46136f4b9f2ecc9c2e4a612c8efe034781886f88))

### CI/CD

* refactor QA workflow and add integration tests ([0edd766](https://github.com/fdosruiz/packetjs/commit/0edd76683ba2dd44d84e968df9ee19f4eaf43d7b))
* update Node.js versions in workflows to include 22.x ([6309493](https://github.com/fdosruiz/packetjs/commit/630949369ca047bb1f44925f034a6859c30cb64c))

### Documentation

* add `axios` middleware example to documentation ([ca345c9](https://github.com/fdosruiz/packetjs/commit/ca345c9102165af40d0ccf2db999fa61ac2599b3))
* add bug report issue template ([80e4895](https://github.com/fdosruiz/packetjs/commit/80e48958808d3349bbc3634aafc5b9a4252de17b))
* add cache middleware documentation to Middleware class ([a06193c](https://github.com/fdosruiz/packetjs/commit/a06193ccc56f4bacea2282c9570d87a35af505b5))
* add clarifications and fix formatting in README.md ([362a22e](https://github.com/fdosruiz/packetjs/commit/362a22e73a1be7b6842d96ab588c02c1ba2cab0d))
* add Contributor Covenant Code of Conduct ([369742a](https://github.com/fdosruiz/packetjs/commit/369742ab03783d195e7dfcd2a1c4a02f6f6d8056))
* add issue templates for feature requests and documentation issues [PTJSD-6] ([d258156](https://github.com/fdosruiz/packetjs/commit/d2581568606d543ec42ae81eda15541e5ba7cf94))
* add licensing information to core files [PTJSD-5] ([87177d7](https://github.com/fdosruiz/packetjs/commit/87177d7f577c717c0c75e2e1bb8da79beb4c310f))
* add Markdown documentation and update dependencies [PTJSD-5] ([0b65ee7](https://github.com/fdosruiz/packetjs/commit/0b65ee70c7f2db28c81b307707a1eda31bbcb12f))
* add PR template for standardized submissions [PTJSD-5] ([d5be30e](https://github.com/fdosruiz/packetjs/commit/d5be30eeb0c97965b1923cb0651e9335707cfaa2))
* correct the heading for Axios middleware example [PTJSD-5] ([15f787a](https://github.com/fdosruiz/packetjs/commit/15f787aac7126ab43219ef76359569aca9a89ff7))
* fix broken links in README.md [PTJSD-7] ([aa06802](https://github.com/fdosruiz/packetjs/commit/aa0680298975ae1b80bfb4b0ec14db3752bd5322))
* Fix broken markdown links in README.md ([e0eabd5](https://github.com/fdosruiz/packetjs/commit/e0eabd56a5b8b72d54226bd9fdb93c6db575699e))
* fix punctuation in Cache.ts documentation ([b1ddc3f](https://github.com/fdosruiz/packetjs/commit/b1ddc3fbc3f001a1ddc4e00f177d195005bd1df6))
* refactor README links to point to external wiki [PTJSD-7] ([cdc3765](https://github.com/fdosruiz/packetjs/commit/cdc3765e5b93d9975c8233122e65154f617ad23b))
* remove middleware example using axios [PTJSD-5] ([f3fd338](https://github.com/fdosruiz/packetjs/commit/f3fd33881e8cef71d350a1b9c4751d89ec9b4bfd))
* update CONTRIBUTING.md documentation [PTJSD-7] ([37fbb99](https://github.com/fdosruiz/packetjs/commit/37fbb99e01046ee98503d1466bc0c2c3ec22759c))
* update package description in package.json ([24308e5](https://github.com/fdosruiz/packetjs/commit/24308e567d1f7615fecc62dbdc2621928cc30f3d))
* Update project description in package.json ([b6e9618](https://github.com/fdosruiz/packetjs/commit/b6e9618e08e02ccdcdc20803d27ac51826b843bb))
* update README and reorganize documentation ([30cfd80](https://github.com/fdosruiz/packetjs/commit/30cfd80dfbbe211b5ff22db94d309a0e5eee6eaf))
* update README links and restructure considerations [PTJSD-7] ([3182b1b](https://github.com/fdosruiz/packetjs/commit/3182b1b3b61307c280a11c424572a2ff0890ab95))
* update README.md with improved content and structure ([97f74fd](https://github.com/fdosruiz/packetjs/commit/97f74fdf41178111e02aa6d2116b11bc55a661ef))
* update singleton documentation in container type definition ([96a577c](https://github.com/fdosruiz/packetjs/commit/96a577cd190eb6f7d857b825192bed902cf9567a))
* update TypeScript method signatures in README.md ([931bffd](https://github.com/fdosruiz/packetjs/commit/931bffdebd8072750860dd73d530b2e44dfe7771))
* uUpdate CONTRIBUTING.md with detailed contribution guide [PTJSD-5] ([89f44d0](https://github.com/fdosruiz/packetjs/commit/89f44d01f4627d9d873a7cb14a41d29baebff3f7))

### Refactoring

* PTJSD-9 refactor type definitions and update imports ([eba1790](https://github.com/fdosruiz/packetjs/commit/eba1790d318e5616753bd34464d1923d97931fcd))
* refactor 'get' methods to accept options object [PTJSD-10] ([ef20b21](https://github.com/fdosruiz/packetjs/commit/ef20b21818b3ef2b76553100568fa23862ef00e2))
* refactor build setup and add Rollup for building TypeScript definitions ([9bf2072](https://github.com/fdosruiz/packetjs/commit/9bf20720e36fb75d6809f4f179a7ffc9257a1524))
* refactor imports to streamline container usage ([6578402](https://github.com/fdosruiz/packetjs/commit/6578402f5b898dd6a2745a9f95a7dc3d39c0d17f))
* refactor method parameters and handlers to improve clarity ([01a34e1](https://github.com/fdosruiz/packetjs/commit/01a34e13750a276677cd113dfe607bb0edeb0fa1))
* refactor proxy flag handling in service container ([32112d7](https://github.com/fdosruiz/packetjs/commit/32112d7f031b555ea2f31a0ba7173aea41a6a8af))
* refactor type import paths ([0866df2](https://github.com/fdosruiz/packetjs/commit/0866df227e3bd2831fb74d6f934ca6532b250be2))
* rename middlewareProxy to proxyMiddleware ([3d4cc6d](https://github.com/fdosruiz/packetjs/commit/3d4cc6d66c27cf2f915de57d31e8540fefed3a57))

### Code formating

* fix linter error in index.test.js ([884bae2](https://github.com/fdosruiz/packetjs/commit/884bae2a9d03b250b6213c91c790e64385acf520))
* refactor tests and update code ([b21a555](https://github.com/fdosruiz/packetjs/commit/b21a5555d733ea3744a69375f60fe1414dcf6e36))
* remove eslint-plugin-react-hooks and update ESLint config ([be90ac7](https://github.com/fdosruiz/packetjs/commit/be90ac755993c8e53656d66ba75aa9b71bf6a2bf))

### Tests

* add async middleware integration tests and clean up code formatting ([85f7841](https://github.com/fdosruiz/packetjs/commit/85f784194e9b9e302e9a7c28fc0561c2ae450fd9))
* add integration tests for common sandbox environment ([1295782](https://github.com/fdosruiz/packetjs/commit/12957827e3fc4eb6f8018f0c4c853fc032d42482))
* add linting step to test-all script ([95d2216](https://github.com/fdosruiz/packetjs/commit/95d22160b9904a74f160842679e665fe2bf159ee))
* add Middleware unit tests and update test scripts for lib code testing ([225fa29](https://github.com/fdosruiz/packetjs/commit/225fa29f91019252b11f409ff260a8b5a7f2fca7))
* add unit testing for middleware, cache, and container and enable verbose mode in Jest ([a3f12f9](https://github.com/fdosruiz/packetjs/commit/a3f12f9057978305fb7bdd0ca61fab96ae0c3b2b))
* fix typo in options object key ([0d32dc2](https://github.com/fdosruiz/packetjs/commit/0d32dc257d241fd5caba4dedd2bb95c2cb687f5d))
* ignore example files in code coverage ([4cd034b](https://github.com/fdosruiz/packetjs/commit/4cd034b7658b9d6ab9410cfc49a60cb88a224646))
* refactor sandbox structure and enhance middleware testing ([845c868](https://github.com/fdosruiz/packetjs/commit/845c86884d10da08217d827133d1ed25d795f155))
* refactor sandbox.js: add utility functions and CICD checks ([60f8fe6](https://github.com/fdosruiz/packetjs/commit/60f8fe65f568be71bdce5aab87ca59d1608329e9))
* remove uniqid module and update references ([73e0d52](https://github.com/fdosruiz/packetjs/commit/73e0d523f96feb4da212f32a875dc1fb8cf38097))
* rename `middlewareProxy` to `proxyMiddleware` in integration tests ([edd9eab](https://github.com/fdosruiz/packetjs/commit/edd9eab681516b1a93b8f8838828c6067abad753))
* rename `middlewareProxy` to `proxyMiddleware` in tests. ([377cb92](https://github.com/fdosruiz/packetjs/commit/377cb92991e4f12e83e115b5e9d7df1483302cbe))
* rename `middlewaresStack` to `middlewareStack` in tests ([d899a86](https://github.com/fdosruiz/packetjs/commit/d899a86a800ec8407e772e04fa7860e3078952f4))
* restructure test directory for better organization ([5d97119](https://github.com/fdosruiz/packetjs/commit/5d97119a408ace9cf3b99ee6140a45fe33c90453))
* update variable name and modify test script order ([c38b18a](https://github.com/fdosruiz/packetjs/commit/c38b18a95da09cde7f6ac75b11869f6e150ee482))

### Examples

* add Comments type handling and fix mutable properties ([db45926](https://github.com/fdosruiz/packetjs/commit/db459269fb0a77de92398b839b89db2e39f66fa9))
* add initial setup for Vite + React example project ([407039c](https://github.com/fdosruiz/packetjs/commit/407039cc92f535a384b6d121a3d01d0cb7c50520))
* add practical examples section and update includes [PTJSD-7] ([5a1c489](https://github.com/fdosruiz/packetjs/commit/5a1c4890a2d4bee3f36f880ae62a865254b12d23))
* add React app with TypeScript and Vite for the middleware example ([b85367d](https://github.com/fdosruiz/packetjs/commit/b85367dbe1e799897e17ba514227b2921cb8ca45))
* add the initial configuration of the Vanilla Javascript project in the examples folder ([0f3ef3a](https://github.com/fdosruiz/packetjs/commit/0f3ef3ac3d9f1e4abbf362182ef699b6de6ff995))
* add the initial configuration of the Vanilla TypeScript project in the examples folder ([104f46d](https://github.com/fdosruiz/packetjs/commit/104f46dd9d70eb3efed6d2de321584d3c08d8b32))
* add TypeScript React example with dependency injection ([739df4c](https://github.com/fdosruiz/packetjs/commit/739df4cab026d41535f0eacc4ae0135e180f3d1b))
* refactor examples projects ([d8a03fa](https://github.com/fdosruiz/packetjs/commit/d8a03fac80aef121122803dee79386d103804900))
* refactor Helper service to use hook implementation ([66d2ed0](https://github.com/fdosruiz/packetjs/commit/66d2ed0f5667c501af7db5c1ebd6ce0993223e45))
* remove unused TypeScript declaration files ([c69b7a1](https://github.com/fdosruiz/packetjs/commit/c69b7a18b7b41f1676e2111ad34cafe333875fd0))
* rename example directories for consistent project structure [PTJSD-7] ([557d49e](https://github.com/fdosruiz/packetjs/commit/557d49ef19b4481e9502e63059c37a496f2e8819))
* reorder imports in main.tsx ([b58caaf](https://github.com/fdosruiz/packetjs/commit/b58caaf09caa93c10eb0468a607936152a13b192))
* Replace 'Helper' service with 'useHelper' hook ([58ee001](https://github.com/fdosruiz/packetjs/commit/58ee001ee2871d9277e996685894fe3469a66c04))
* simplify type definitions in Helper class in typescript vanilla ([cf1fce5](https://github.com/fdosruiz/packetjs/commit/cf1fce5c5f3c118f06fd08e92eafb50accc6877b))
* update import paths and rename file locations ([1e38907](https://github.com/fdosruiz/packetjs/commit/1e389073226d603eebfca05d6112fa43c0848dc1))
* update translation text in index.json ([b9e6c25](https://github.com/fdosruiz/packetjs/commit/b9e6c25550a482dd5400324f91a20da32ea41ec5))
* update type exports and imports for better consistency ([c1ba2a0](https://github.com/fdosruiz/packetjs/commit/c1ba2a0ef364676bdef1a34185be3f5259cc1108))

## [1.3.4](https://github.com/fdosruiz/packetjs/compare/v1.3.3...v1.3.4) (2024-07-09)

### Bug Fixes

* update Node.js version and npm registry URL in workflows ([49faebb](https://github.com/fdosruiz/packetjs/commit/49faebb00555e4f26207c77605ab158a37430e1c))

## [1.3.3](https://github.com/fdosruiz/packetjs/compare/v1.3.2...v1.3.3) (2024-07-09)

### Trivial Changes

* update Node engine version and keywords in package.json ([146feeb](https://github.com/fdosruiz/packetjs/commit/146feeb5c2252d45a6267a1e33ef18edefa1152b))

### CI/CD

* improve github workflow to detect problems with babel transpilation, over each node version ([7a0c359](https://github.com/fdosruiz/packetjs/commit/7a0c35958a49c578b0b61a35274399f0db359aec))

### Documentation

* update README.md description ([83eae6a](https://github.com/fdosruiz/packetjs/commit/83eae6ad699224c25294e77a15155b5472a1d504))

## [1.3.2](https://github.com/fdosruiz/packetjs/compare/v1.3.1...v1.3.2) (2024-07-08)

### Bug Fixes

* update Babel configuration for core-js dependency ([f120198](https://github.com/fdosruiz/packetjs/commit/f12019828c39df4626b72acc2b4048b6d220ad81))

## [1.3.1](https://github.com/fdosruiz/packetjs/compare/v1.3.0...v1.3.1) (2024-07-07)

### Bug Fixes

* resolve the fix with babel transpile for node 8.6.0 and above. ([0d951af](https://github.com/fdosruiz/packetjs/commit/0d951af5f0d2f86c5a809e0acb5904226b84da1c))
* resolve the fix with babel transpile for node 8.6.0 and above. ([7ff213d](https://github.com/fdosruiz/packetjs/commit/7ff213d288713fd29137ceb2161875368e488414))

## [1.3.0](https://github.com/fdosruiz/packetjs/compare/v1.2.8...v1.3.0) (2024-07-07)

### Revert Changes

* downgrade various devDependencies ([c3c59ac](https://github.com/fdosruiz/packetjs/commit/c3c59ac8f0bb1a7941f03ecd45174c4626af54b3))

### Features

* add caching functionality for method calls ([80e1822](https://github.com/fdosruiz/packetjs/commit/80e1822faa029676841e0b3c61f764ec7af24bc1))
* implement exclusion filter mode for caching system ([e1244ae](https://github.com/fdosruiz/packetjs/commit/e1244ae5f22b21a906889a92decfc77b89df676e))

### CI/CD

* enable Coveralls in GitHub Actions ([2c714dc](https://github.com/fdosruiz/packetjs/commit/2c714dc808365b814fa88d29e8c8f826973aaaa9))
* remove test.yml and update Node.js version in workflows ([5ac56f6](https://github.com/fdosruiz/packetjs/commit/5ac56f6e68aef715c8a974419cfda6454c00a036))
* update .releaserc configurations ([1e5d106](https://github.com/fdosruiz/packetjs/commit/1e5d10621b403ba9e08b62a0f62182e962351440))

### Documentation

* add testing instructions to CONTRIBUTING.md ([f09584b](https://github.com/fdosruiz/packetjs/commit/f09584b9ba3c6c1d3cb75139a2f3dee2a2e4345b))
* update Container.ts documentation ([0ecf04f](https://github.com/fdosruiz/packetjs/commit/0ecf04fe2520fdf2194d8eca89dba47dd1c9abd6))
* update README with enhanced project description ([c57db0e](https://github.com/fdosruiz/packetjs/commit/c57db0ebee70193c3e3f389a76649edf1588d00e))
* update README.md with improved description and contents ([a02a35e](https://github.com/fdosruiz/packetjs/commit/a02a35e706b20825c75f5aa3d94e85779c880c5f))

### Refactoring

* move type definitions to separate file ([0fca5d0](https://github.com/fdosruiz/packetjs/commit/0fca5d0a27f1ea4f017c51253b6207ee427eb0ec))
* refactor Cache class and update IServiceOptions type ([4403bc7](https://github.com/fdosruiz/packetjs/commit/4403bc7d37bac2c7c2c4bd45aea57a170475880f))
* replace 'config' with 'options' in caching logic ([249f2f4](https://github.com/fdosruiz/packetjs/commit/249f2f429c3b58821c95cc0cb30ad620783b302f))
* replace context array with Map in Container ([e8b8904](https://github.com/fdosruiz/packetjs/commit/e8b89040cb7c57682787100f67019a1e7f6f434f))
* update method caching and typing in core classes ([65b62ad](https://github.com/fdosruiz/packetjs/commit/65b62ad0bc47b3e786a58a7031d574b780a0fcff))

### Tests

* create tests for the new implementations, refactor the test files, and update package dependencies ([c00ea18](https://github.com/fdosruiz/packetjs/commit/c00ea189431791b58f1a7c2d0ce4f2ca5c7c1401))
* refactor code for common sandbox tests ([26c7cfb](https://github.com/fdosruiz/packetjs/commit/26c7cfbbf3fc11aa394234793b21faa1cdb30a7d))

## [1.2.8](https://github.com/fdosruiz/packetjs/compare/v1.2.7...v1.2.8) (2024-06-30)

### Tests

* update Babel configuration and add tests for the Container class over lib directory ([7887072](https://github.com/fdosruiz/packetjs/commit/7887072f1c58d81e84212034a7846a31c6436142))

## [1.2.7](https://github.com/fdosruiz/packetjs/compare/v1.2.6...v1.2.7) (2024-06-25)

### Trivial Changes

* update package keywords in package.json ([c7b6cf0](https://github.com/fdosruiz/packetjs/commit/c7b6cf056b411f107ef2a88471b8660e651304d7))

## [1.2.6](https://github.com/fdosruiz/packetjs/compare/v1.2.5...v1.2.6) (2024-06-25)

### Trivial Changes

* add files to .npmignore ([cdc7127](https://github.com/fdosruiz/packetjs/commit/cdc7127ff3bed38c071610def6feb8212591f93f))
* move semantic-release configuration to separate file to improve npm package size ([29edc59](https://github.com/fdosruiz/packetjs/commit/29edc59c7618dcf24b7cd75397151f3b8fc6111d))

## [1.2.5](https://github.com/fdosruiz/packetjs/compare/v1.2.4...v1.2.5) (2024-06-25)

### Trivial Changes

* add files to .npmignore ([ff534ed](https://github.com/fdosruiz/packetjs/commit/ff534ed7baad9c89a7dc2161cc829f0bebc8ee21))

### CI/CD

* update stage names for the workflows ([b7aa11f](https://github.com/fdosruiz/packetjs/commit/b7aa11f257c1fb4a7321ce226f60907e3c1afd45))

### Documentation

* update documentation. README.md and CONTRIBUTING.md ([3edd3cd](https://github.com/fdosruiz/packetjs/commit/3edd3cd11fb5ada529d749332a936730088108f8))

## [1.2.4](https://github.com/fdosruiz/packetjs/compare/v1.2.3...v1.2.4) (2024-06-25)

### Bug Fixes

* config semantic release for changelog.md ([b5f159c](https://github.com/fdosruiz/packetjs/commit/b5f159cd0b2c718127dbead4bea2c9bc4a967990))
