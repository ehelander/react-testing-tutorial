# react-components-test-setup

[![Build Status](https://travis-ci.org/rwieruch/react-components-test-setup.svg?branch=master)](https://travis-ci.org/rwieruch/react-components-test-setup) [![Coverage Status](https://coveralls.io/repos/github/rwieruch/react-components-test-setup/badge.svg?branch=master)](https://coveralls.io/github/rwieruch/react-components-test-setup?branch=master) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/rwieruch/react-components-test-setup.svg)](https://greenkeeper.io/)

A solid test setup for React components with Mocha, Chai, Sinon, Enzyme and Jest in a [Webpack/Babel/React](https://github.com/rwieruch/minimal-react-webpack-babel-setup) application.

Read more about it: [React Testing Tutorial: Test Frameworks & Component Tests](https://www.robinwieruch.de/react-testing-tutorial/)

## Features

* React 16
* Webpack 4
* Babel
* Staging ES Next Features
* Hot Module Replacement
* Testing
  * Mocha
  * Chai
  * Enzyme
  * Sinon
  * Jest
  * Unit/Integration Test (Chai, Enzyme) Watcher
  * Snapshot Test (Jest) Watcher
  * Travis CI
  * Coveralls.io

## Installation

* `git clone git@github.com:rwieruch/react-components-test-setup.git`
* cd react-components-test-setup
* npm install
* npm start
* visit `http://localhost:8080/`

# Eric's Notes
- [React Testing Tutorial: Test Frameworks & Component Tests](https://www.robinwieruch.de/react-testing-tutorial/)
- `create-react-app` comes with Jest as a test runner and assertion library. 
- Testing pyramid
  - write mostly unit tests
  - followed by some integration tests
  - and only a few end-to-end tests
- Second testing philosophy for React:
  - Write mostly integration tests and not so many unit tests.

## Psuedo React Application Setup for Testing
- `create-react-app react-testing`
- It's ok to export components and functions from a file solely for the sake of testing.

## Mocha with Chai Test Setup in React
- 3 libraries needed for a minimal test environment: 
  - 1: There needs to be an entity which is responsible for running all of our tests in a certain framework.
    - [Mocha](https://github.com/mochajs/mocha)
      - `npm install --save-dev mocha`
      - Popular test runner for React applications
        - vs. Karma: popular for testing Angular applications
  - 2: There needs to be an entity which can be used to make assertions.
    - [Chai](https://github.com/chaijs/chai)
      - `npm install --save-dev chai`
  - 3: React components need some kind of artifical browser environment (because they render HTML in the browser's DOM).
    - [jsdom](https://github.com/jsdom/jsdom)
      - `npm install --save-dev jsdom`
      - Makes sure you can reate the artificial browser.
  - Configure libraries together to start testing:
    - terminal:
      ```
      mkdir test
      cd test
      touch helpers.js dom.js
      ```
    - Make `expect` function (and others in the future) globally accessible to all test files.
      - `test/helpers.js`
        ```
        import { expect } from 'chai';

        global.expect = expect;
        ```
    - Set up pseudo browser environment
      - Mimic the browser (DOM) for React component tests. Probably never have to touch this file again.
      - `test/dom.js`
        ```
        import { JSDOM } from 'jsdom';

        const { window } = new JSDOM('<!doctype html><html><body></body></html>');

        function copyProps(src, target) {
          const props = Object.getOwnPropertyNames(src)
            .filter(prop => typeof target[prop] === 'undefined')
            .reduce((result, prop) => ({
              ...result,
              [prop]: Object.getOwnPropertyDescriptor(src, prop),
            }), {});
          Object.defineProperties(target, props);
        }

        global.window = window;
        global.document = window.document;
        global.navigator = {
          userAgent: 'node.js',
        };

        copyProps(window, global);
        ```
    - Define `npm run test` in `package.json`
      ```
      "scripts": {
        "start": "webpack-dev-server --config ./webpack.config.js",
        "test:unit": "mocha --require @babel/register --require ./test/helpers.js --require ./test/dom.js 'src/**/*.spec.js'"
      },
      ```
      - If `@babel/register` has not yet been installed: `npm install -save-dev @babel/register`
      - Run via `npm run test:unit`
    - Add a second script that runs `npm run test:unit` in watch mode (rerunning upon each change to source or test files): `"test:unit:watch": "npm run test:unit -- --watch"`
    - One more useful library: [ignore-styles](https://github.com/bkonkle/ignore-styles)
      - `npm install --save-dev ignore-styles`
      - Enables test to ignore styles (since they shouldn't necessarily affect the tests)
      - Add `--require ignore-styles 'src/**/*.spec.js'` at the end of the `test:unit` command.

## Unit Tests for React State Changes
- Functions are perfect candidates for unit tests (assuming they're pure): take an input, return an output.
- `touch App.spec.js`
  ```
  describe('Local State', () => {
    it('should increment the counter in state', () => {

    });

    it('should decrement the counter in state', () => {

    });
  });
  ```
  - `describe` block defines the test suite
  - `it` defines the test cases
    - 3 steps:
      - arrange
      - act
      - assert
    ```
    import { doIncrement, doDecrement } from './App';

    describe('Local State', () => {
      it('should increment the counter in state', () => {
        const state = { counter: 0 };
        const newState = doIncrement(state);

        expect(newState.counter).to.equal(1);
      });

      it('should decrement the counter in state', () => {
        const state = { counter: 0 };
        const newState = doDecrement(state);

        expect(newState.counter).to.equal(-1);
      });
    });
    ```
- Note: Ended up adding `import { expect } from 'chai';` and using `npm run test` instead.

## Enzyme Test Setup in React
- Enzyme:
  - Library created by Airbnb, introduced for component tests.
  - For testing React components with unit and integration tests
  - `npm install --save-dev enzyme`
  - Adapter depends on React version
    - `npm install --save-dev enzyme-adapter-react-16`
- Set up Enzyme in `test/helpers.js`
  ```
  import { expect } from 'chai';
  import { mount, render, shallow, configure} from 'enzyme';
  import Adapter from 'enzyme-adapter-react-16';

  configure({ adapter: new Adapter() });

  global.expect = expect;

  global.mount = mount;
  global.render = render;
  global.shallow = shallow;
  ```
  - Prevents the need to explicitly import `shallow, render, mount` explicitly in test files.

## React Testing with Enzyme: Unit and Integration Tests for React Components
- `src/App.spec.js`
  ```
  import React from 'react';
  import App, { doIncrement, doDecrement, Counter } from './App';

  describe('Local State', () => {
  ...
  });

  describe('App Component', () => {
    it('renders the Counter wrapper', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(Counter)).to.have.length(1);
    });
  });
  ```
- _Note_
  - https://github.com/react-cosmos/react-cosmos/issues/567
  - https://facebook.github.io/create-react-app/docs/running-tests
  