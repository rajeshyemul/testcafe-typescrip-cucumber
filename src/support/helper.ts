import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { GENERATE_CUCUMBER_HTML_REPORT } from '../environment';


/**
 * The purpose of this temporary test-file is to capture TestCafes' TestController.
 * We basically create and run a dummy test and capture the TestController for future tests.
 */
export const createTestFile = (name: string) => {
    writeFileSync(
        name,
        `import { testControllerHolder } from "./src/support/test-controller-holder";
      fixture("TestController")
      test("capture", testControllerHolder.capture)`
    );
};

/**
 * Generates the HTML report if {@link GENERATE_CUCUMBER_HTML_REPORT} is `true`
 */
export const generateHtmlReport = () => {
    if (GENERATE_CUCUMBER_HTML_REPORT) {
        try {
            console.log('Generating HTML report...');
            exec(`node ${process.cwd()}/cucumber-html.config.js`);
        } catch (error) {
            console.error('Could not generate cucumber html report', error);
        }
    }
};