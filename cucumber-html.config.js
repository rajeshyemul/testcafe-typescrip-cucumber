const reporter = require('multiple-cucumber-html-reporter');

const options = {
      reportName: 'Testcafe Cucumber and Typescript Automation Test Report',
      jsonDir: 'reports',
      reportPath: `reports/htmlReport`,
      openReportInBrowser: false,
      displayDuration: true,
      displayReportTime: true,
      disableLog:false,
      metadata:{
        browser: {
            name: 'chrome',
            version: '60'
        },
        device: 'Local test machine',
        platform: {
            name: 'ubuntu',
            version: '16.04'
        }
    },
    customData: {
        title: 'Run info',
        data: [
          { label: 'Report Generation Time', value: `${new Date().toLocaleString()}` }
        ]
    }
};

reporter.generate(options);

