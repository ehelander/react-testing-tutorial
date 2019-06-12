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

## [Psuedo React Application Setup for Testing](https://www.robinwieruch.de/react-testing-tutorial/#react-test-setup)
- `create-react-app react-testing`
- It's ok to export components and functions from a file solely for the sake of testing.

## Mocha and Chai
### [Mocha with Chai Test Setup in React](https://www.robinwieruch.de/react-testing-tutorial/#react-mocha-chai-test-setup)
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

### [Unit Tests for React State Changes](https://www.robinwieruch.de/react-testing-tutorial/#react-component-tests-state-unit)
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

## Enzyme
### [Enzyme Test Setup in React](https://www.robinwieruch.de/react-testing-tutorial/#react-enzyme-test-setup)
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
### [React Testing with Enzyme: Unit and Integration Tests for React Components](https://www.robinwieruch.de/react-testing-tutorial/#react-component-tests-integration)
- `src/App.spec.js`: check the rendered HTML tag
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
- `shallow`
  - Simplest form of rendering a component with Enzyme.
  - Only renders the component; not the content of child components: enables testing the component in isolation.
  - `.length(1)`: There should only be one Counter component.
  - Can also check specific HTML tags or CSS classes
    - `.find('li')`
    - `.find('.list')`
  - Can also check rendered HTML elements by selecting them with [Enzyme selectors](https://github.com/airbnb/enzyme/blob/master/docs/api/selector.md)
    - Can also check conditional rendering (length 0 or 1)
- Assert whether the correct props are being passed to the next component.
  ```
  describe('App Component', () => {
    it('renders the Counter wrapper', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(Counter)).to.have.length(1);
    });

    it('passes all props to Counter wrapper', () => {
      const wrapper = shallow(<App />);
      let counterWrapper = wrapper.find(Counter);

      expect(counterWrapper.props().counter).to.equal(0);

      wrapper.setState({ counter: -1 });

      counterWrapper = wrapper.find(Counter);
      expect(counterWrapper.props().counter).to.equal(-1);
    });
  });
  ```
- Can simulate clicks with Enzyme
  ```
  it('increments the counter', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(0).simulate('click');

    expect(wrapper.state().counter).to.equal(1);
  });

  it('decrements the counter', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(1).simulate('click');

    expect(wrapper.state().counter).to.equal(-1);
  });
  ```
  - With multiple buttons, can use `at()` to access the index of the desired element. But would be better to use a more specific Enzyme selector.
- Test patterns: Test that
  - Functions alter component state correctly
  - Component renders without the child component hierarchy (`shallow()`)
  - Component renders entire component hierarchy
    - With lifecycle methods (`mount()`)
    - Or without lifecycle methods (`render()`)
- Testing philosophies
  - Testing pyramid (most common approach in software engineering)
    - Says you should have 
      - Lots of unit tests
      - Several integration tests
      - A few integration tests
  - Component test approach
    - Says you should have
      - Few unit tests
        - Not very likely to break (because they're _too_ isolated from the rest of the application)
      - Many integration tests
        - Test components _in the context of_ other components.
    - Use more `mount()` or `render()`, less `shallow()`.
      - Render, test, verify existence and behavior of entire component tree.

## Sinon
### [Sinon Test Setup in React](https://www.robinwieruch.de/react-testing-tutorial/#react-sinon-test-setup)
- Introduce an artificial asynchronous scenario
  - Fetch data in `componentDidMount()`
  - `npm install --save axios`
  ```
  import React, { Component } from 'react';
  import axios from 'axios';

  ...

  class App extends Component {
    constructor() {
      super();

      this.state = {
        counter: 0,
        asyncCounters: null,
      };

      this.onIncrement = this.onIncrement.bind(this);
      this.onDecrement = this.onDecrement.bind(this);
    }

    componentDidMount() {
      axios.get('http://mypseudodomain/counter')
        .then(counter => this.setState({ asyncCounters: counter }))
        .catch(error => console.log(error));
    }

    onIncrement() {
      this.setState(doIncrement);
    }

    onDecrement() {
      this.setState(doDecrement);
    }

    render() {
      ...
    }
  }

  ...

  export default App;
  ```
  - Sinon
    - `npm install --save-dev sinon`
    - For testing asynchronous data
      - Spies, stubs, mocks
    - Add Sinon as another global function in `test/helpers.js`
### [React Testing with Sinon](https://www.robinwieruch.de/react-testing-tutorial/#react-sinon-testing)
- Spy
  - A spy can be used on any function for assertions. After a spy is called, you can assert (for example) how many times the function was called for the test.
    ```
    describe('App Component', () => {
      it('calls componentDidMount', () => {
        sinon.spy(App.prototype, 'componentDidMount');

        const wrapper = mount(<App />);
        expect(App.prototype.componentDidMount.calledOnce).to.equal(true);
      });
    });
    ```
  - Note, though, that this is just for demonstration. It doesn't make sense to test React lifecycle methods.
  - Mocha `before()` and `after()` (happen before/after the `describe()` test suites).
- Stub
  - Test stubs are functions (spies) with pre-programmed behavior: enables full control over spies.
  ```
  import React from 'react';
  import axios from 'axios';
  import App, { doIncrement, doDecrement, Counter } from './App';

  ...

  describe('App Component', () => {
    const result = [3, 5, 9];
    const promise = Promise.resolve(result);

    before(() => {
      sinon.stub(axios, 'get').withArgs('http://mydomain/counter').returns(promise);
    });

    after(() => {
      axios.get.restore();
    });

    ...
  });
  ```
  - `.restore()` makes sure the `get()` method we stubbed earlier is returned to it's native behavior.
  ```
  describe('App Component', () => {
    const result = [3, 5, 9];
    const promise = Promise.resolve(result);

    before(() => {
      sinon.stub(axios, 'get').withArgs('http://mydomain/counter').returns(promise);
    });

    after(() => {
      axios.get.restore();
    });

    ...

    it('fetches async counters', () => {
      const wrapper = shallow(<App />);

      expect(wrapper.state().asyncCounters).to.equal(null);

      promise.then(() => {
        expect(wrapper.state().asyncCounters).to.equal(result);
      });
    });
  });
  ```

## Jest
### [Jest Test Setup in React](https://www.robinwieruch.de/react-testing-tutorial/#react-jest-test-setup)
### [React Testing with Jest](https://www.robinwieruch.de/react-testing-tutorial/#react-jest-snapshot-tests)

## End-to-end (E2E) Tests
### [React End-to-end (E2E) Tests with Cypress.io](https://www.robinwieruch.de/react-testing-tutorial/#react-e2e-tests-cypress)

## CI and Tests
### [React Component Tests and Continuous Integration](https://www.robinwieruch.de/react-testing-tutorial/#react-component-tests-continuous-integration)
### [React Component Test Coverage with Coveralls](https://www.robinwieruch.de/react-testing-tutorial/#react-component-test-coverage-coveralls)
