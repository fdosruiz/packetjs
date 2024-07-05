# Contribution Guide

## 1. Create the branch locally and publish it

    git checkout -b BRANCH-NAME

## 2. Make the necessary code changes and commits

### 2.1 Code

When writing code, the developer must ensure that its quality is optimal, so the project's formatting rules, linting,
and good practices for writing clean, modern code must be adhered to.

### 2.2 Commits

```shell
$ git commit -m "<type>[optional scope]: <description>
[optional body]
[optional footer(s)]"
```

Commit messages must follow the specifications of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
using one of the following types:

- `feat`: all changes that introduce new code or features.
- `fix`: changes that fix errors.
- `refactor`: code refactoring.
- `perf`: changes that improve performance.
- `docs`: changes or creation of documentation.
- `build`: changes related to build processes or changes in project dependencies.
- `test`: changes in unit tests.
- `ci`: changes related to the configuration of continuous integration processes.
- `style`: formatting changes that do not affect code logic (white spaces, line breaks, quotes, etc.)
- `chore`: any other change that does not belong to the types above.

## 3. Add tests

Use the following path to add tests:

    tests/src
    tests/lib

Use the common tests to add tests, if needed.

    tests/common

Run `npm run build` to ensure that code is up-to-date in lib directory.

## 3. Run Unit Tests

    npm run test

## 4. Run Linting

    npm run lint

## 5. Publish Changes

    git push -u origin BRANCH-NAME

## 6. Create a Pull Request (PR)

Create a PR from the new branch to the main branch.
