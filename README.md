This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

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

