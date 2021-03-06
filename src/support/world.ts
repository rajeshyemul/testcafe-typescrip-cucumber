import { base64Sync } from 'base64-img';
import { testControllerHolder } from './test-controller-holder';
import { setDefaultTimeout, setWorldConstructor, World } from 'cucumber';
import * as chai from 'chai';
import * as chaiString from 'chai-string';
const screenshot = require('screenshot-desktop');

chai.use(chaiString);

const DEFAULT_TIMEOUT = 30 * 1000;

function CustomWorld(this: World, { attach }) {
    this.worldName = 'Your E2E World';
    /**
     * this function is crucial for the Given-Part of each feature as it provides the TestController
     */
    this.getTestController = testControllerHolder.get;

    /**
     * function that attaches the attachment (e.g. screenshot) to the report
     */
    this.attach = attach;

    this.addScreenshotToReport = async function () {
        await (await this.getTestController())
            .takeScreenshot()
            .then(this.attachScreenshotToReport)
            .catch(async error => {
                // Workaround for https://github.com/DevExpress/testcafe/issues/4231
                console.log('encountered an error during taking screenshot, retry using another library...', error);
                await screenshot({ format: 'png' }).then(image => {
                    console.log('screenshot taken!');
                    return this.attachScreenshotInPngFormatToReport(image);
                });
            });
    };

    /**
     * Adds the screenshot under the given path to the json report
     * @param pathToScreenshot The path under which the screenshot has been saved
     */
    this.attachScreenshotToReport = (pathToScreenshot: string) => {
        const imgInBase64 = base64Sync(pathToScreenshot);
        const imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
        return attach(imageConvertForCuc, 'image/png');
    };

    /**
     * Adds the screenshot to the json report
     * @param pngImage the image in png format
     */
    this.attachScreenshotInPngFormatToReport = (pngImage: any) => {
        return attach(pngImage, 'image/png');
    };
}

setDefaultTimeout(DEFAULT_TIMEOUT);
setWorldConstructor(CustomWorld);
