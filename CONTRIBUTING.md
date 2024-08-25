# Contribution Guide

Thank you for considering contributing to PacketJS! We appreciate all types of contributions, whether it's bug reports,
feature suggestions, or code improvements. To ensure a smooth and efficient contribution process, please follow the
guidelines below.

## 1. Fork the Repository

To begin contributing, start by forking the repository. This will create a copy of the repository under your GitHub
account. You can do this by clicking the "Fork" button at the top right of the repository page.

## 2. Clone Your Fork

After forking, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/packetjs.git
```

Replace `your-username` with your GitHub username.

## 3. Create a New Branch Locally and Publish It

Create a new branch for your work. This helps keep your changes organized and makes it easier for others to review:

```bash
git checkout -b BRANCH-NAME
```

Use a descriptive branch name, such as `feature/new-parser` or `bugfix/fix-timeout-error`.

## 4. Make the Necessary Code Changes and Commits

### 4.1 Code

When writing code, please ensure that it adheres to the following best practices:

- Follow the project's formatting rules and linting configurations.
- Write clean, readable, and maintainable code that aligns with modern coding standards.
- Ensure your code integrates well with the existing codebase and does not introduce unnecessary complexity.

### 4.2 Commits

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to
maintain a clear and consistent commit history.

Here’s the format for commit messages:

```bash
git commit -m "<type>: <description> [optional scope]
[optional body]
[optional footer(s)]"
```

#### Commit Types:

- **`feat`**: Introducing new features.
- **`fix`**: Fixing bugs.
- **`refactor`**: Refactoring code without adding features or fixing bugs.
- **`deps`**: Updating dependencies.
- **`docs`**: Updating or adding documentation.
- **`example`**: Adding or updating example code.
- **`test`**: Adding or updating tests.
- **`ci`**: Configuring or updating continuous integration.
- **`style`**: Formatting changes (e.g., whitespace, semicolons) that do not affect code logic.
- **`chore`**: Miscellaneous tasks that do not fit into the above categories.

## 5. Add Tests

Ensure your code is properly tested. Place your tests in the appropriate directories:

Unit tests: `tests/unit`

- **Core Functionality Tests**: `tests/unit/src`
- **Library Tests**: `tests/unit/lib`

Both the `src` and `lib` use the same tests from the `tests/unit/common` directory.

Integration tests: `tests/integration`

- **Core Functionality Tests**: `tests/integration/src`
- **Library Tests**: `tests/integration/lib`
- **Common Tests**: `tests/integration/common`

Run the following command to ensure the code is up-to-date in the `lib` directory:

```bash
npm run build
```

## 6. Run Unit Tests

Before pushing your changes, run the unit tests to confirm everything works as expected:

```bash
npm run test
```

## 7. Run Linting

Check the code for linting errors to ensure consistency across the codebase:

```bash
npm run lint
```

## 8. Sync with the Original Repository

Before publishing your branch, ensure it is up-to-date with the latest code from the original repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

If you haven’t added the original repository as `upstream`, you can do so with:

```bash
git remote add upstream https://github.com/fdosruiz/packetjs.git
```

## 9. Publish Your Branch

Once your changes are ready and all tests have passed, push your branch to your fork on GitHub:

```bash
git push -u origin BRANCH-NAME
```

## 10. Create a Pull Request (PR)

Create a Pull Request (PR) from your branch to the `main` branch of the original repository. In your PR:

- Provide a detailed explanation of the changes you’ve made.
- Reference any relevant issues that your PR addresses.
- Ensure your branch is up-to-date with the `main` branch of the original repository before submitting.

## 11. Participate in the Review Process

Your PR will be reviewed by a project maintainer. Be prepared to make any requested changes or provide additional
information. Your PR will be merged once it has been approved.

## 12. Licensing

By contributing to PacketJS, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 13. Communication

If you have any questions or need clarification, feel free to open an issue or reach out through the project's
communication channels. We're here to help and ensure that your contribution process is as smooth as possible.
