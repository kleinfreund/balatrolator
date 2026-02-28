# Contributing guidelines

Hello there!

This project follows a [code of conduct](https://github.com/kleinfreund/balatrolator/blob/main/CODE_OF_CONDUCT.md). Please read it. All contributions are subject to it.

## Prerequisites

The following software will be required to contribute to this project:

- git
- Node.js (see .node-version file for version)
- npm (version 10 or higher)

## Development

### Install dependencies

```sh
npm install
```

### Start development server

```sh
npm run start
```

In debug mode:

```sh
npm run start:debug
```


### Run node tests

```sh
npm run test:node
```

In debug mode:

```sh
npm run test:node:debug
```

### Run browser tests

Before running the Playwright tests for the first time (and every time Playwright was updated), the browsers it uses have to be (re-)installed:

```sh
npx playwright install chromium
```

#### Headless

Run the tests in headless mode from the CLI.

```sh
npm run test:browser
```

#### UI

Run the tests in head mode in a dedicated browser UI.

```sh
npm run test:browser:ui
```

### Committing changes

This project follows the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for naming commits.

**Examples**:

```
feat: add support for Blueprint joker
```

```
fix: red seal applying twice
```

## Pull request guidelines

- In case of submitting a contribution for a new feature, please explain briefly why you think the feature is necessary. Ideally, an issue for a feature request was submitted and approved beforehand, but this is not a requirement.
- In case of submitting a contribution that changes or introduces a user interface, ensure that the user interface is accessible: It must be navigable using a pointer device (e.g. mouse, track pad), a keyboard, and a screen reader. This can be tested manually and with the help of automated accessibility checkers such as axe.
- Please provide unit tests for feature or bug fix contributions.
