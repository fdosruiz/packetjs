# Contribution Guide

## 1. Create the branch locally and publish it

```shell
$ git checkout -b BRANCH-NAME
$ git push -u origin BRANCH-NAME
```

## 2. Make the necessary code changes and commits

### 2.1 Code

When writing code, the developer must ensure that its quality is optimal, so the project's formatting rules, linting,
and good practices for writing clean, modern code must be adhered to.
> 💡 Although the project has several layers where code quality is automatically checked, as well as specific npm
> commands that can be executed manually, it is recommended to install extensions in the editor (_ESLint_ and _Prettier_)
> as they allow the code to be adapted as it is written.

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

## 3. Run Unit Tests

    npm run test

## 4. Publish Changes

    git push -u origin BRANCH-NAME

## 5. Create a Pull Request (PR)


