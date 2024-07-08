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
