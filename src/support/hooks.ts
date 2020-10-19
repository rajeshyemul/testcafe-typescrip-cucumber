import { unlinkSync } from 'fs';
import { After, AfterAll, BeforeAll, Status } from 'cucumber';
import { BROWSER } from '../environment';
import { SelectorFactoryInitializer } from '../utils/selector-factory';
import { testControllerHolder } from './test-controller-holder';
import { TestControllerConfig } from './test-controller-config';
import { createTestFile, generateHtmlReport } from './helper';

// tslint:disable-next-line
const createTestCafe: TestCafeFactory = require('testcafe');

const TEST_CAFE_HOST = 'localhost';
const TEST_FILE = 'test.js';
const DELAY = 5 * 1000;

let testCafe: TestCafe;

const state = {
    failedScenarios: 0,
    browserMedadataAdded: false,
    startTime: 0
};

/**
 * Creates a server instance of TestCafe and starts a test-runner.
 * For more info see {@link https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/testcafe.html}
 */
function createServerAndRunTests(): void {
    createTestCafe(TEST_CAFE_HOST)
        .then((tc: TestCafe) => {
            testCafe = tc;
            let runner: Runner = tc.createRunner();

            runner = runner
                .src(`./${TEST_FILE}`)
                .screenshots('out/reports/screenshots/', false) // we can create screenshots manually!
                .browsers(`${BROWSER}`.trim());

            return runner.run({ quarantineMode: true }).catch((error: any) => console.error('Caught error: ', error));
        })
        .then(() => {
            if (state.failedScenarios > 0) {
                console.warn(`🔥🔥🔥 ${state.failedScenarios} scenarios (retry included) failed 🔥🔥🔥`);
            } else {
                console.log(`All tests passed 😊`);
            }
        });
}

/**
 * Runs before all tests are executed.
 *   - collect metadata for the HTML report
 *   - create the dummy test file to capture the {@link TestController}
 *   - create TestCafe and runs the {@link Runner} w.r.t. the set environment variables (config)
 */
BeforeAll((callback: any) => {
    process.env.E2E_META_BROWSER = '';
    state.startTime = new Date().getTime();

    testControllerHolder.register(new TestControllerConfig());
    SelectorFactoryInitializer.init();
    createTestFile(TEST_FILE);
    createServerAndRunTests();
    setTimeout(callback, DELAY);
});

/**
 * AfterEach (scenario):
 *   - take screenshot if the test case (scenario) has failed
 */
After(async function (testCase) {

    if (!state.browserMedadataAdded) {
        state.browserMedadataAdded = true;
    }

    if (testCase.result.status === Status.FAILED) {
        state.failedScenarios += 1;
        await this.addScreenshotToReport();
    }
});

/**
 * Runs after all tests got executed.
 * Hook-Order:
 *   0. Hook: BeforeAll
 *     - execute dummy test ('fixture') and capture TestController
 *   1. Execute feature 1 -> feature n (Hook: After)
 *   2. Hook: After All
 *     - cleanup (destroy TestController, delete dummy test file)
 *     - generate reports (JSON, HTML and JUNIT)
 *     - create file to indicate that tests failed (for CI/CD) if test failed
 *     - shutdown TestCafe
 */
AfterAll((callback: any) => {

    const endTime = new Date().getTime();
    const duration = endTime - state.startTime;

    SelectorFactoryInitializer.destroy();
    testControllerHolder.destroy();

    unlinkSync(TEST_FILE);

    setTimeout(callback, DELAY);
    setTimeout(async () => {
        generateHtmlReport();
        console.log('Shutting down TestCafe...');
        await testCafe.close();
    }, DELAY * 2);
});
