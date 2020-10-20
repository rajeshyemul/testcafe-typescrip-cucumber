import { unlinkSync } from 'fs';
import { After, AfterAll, BeforeAll, Status } from 'cucumber';
import { BROWSER } from '../environment';
import { SelectorFactoryInitializer } from '../utils/selector-factory';
import { testControllerHolder } from './test-controller-holder';
import { TestControllerConfig } from './test-controller-config';
import { createTestFile, generateHtmlReport } from './helper';

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

BeforeAll((callback: any) => {
    process.env.E2E_META_BROWSER = '';
    state.startTime = new Date().getTime();

    testControllerHolder.register(new TestControllerConfig());
    SelectorFactoryInitializer.init();
    createTestFile(TEST_FILE);
    createServerAndRunTests();
    setTimeout(callback, DELAY);
});

After(async function (testCase) {

    if (testCase.result.status === Status.FAILED) {
        state.failedScenarios += 1;
        await this.addScreenshotToReport();
    }
});

AfterAll((callback: any) => {

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
