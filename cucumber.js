// if you develop locally you can influence the executed tests as follows:
// `process.env.TAGS = ' @some-tag'`

// common options
const common = [
  'src/features',
  '--require-module ts-node/register',
  '--require src/**/*.ts'
];

  common.push('--format json:./reports/cucumber_report.json');
  common.push('--retry 0');//specify how many time to try before failing a test

/**
 * A comma separated strings of tags that can be used to limit which feature files to run
 * @example @some-tag1, @some-tag2
 */
const tags = (process.env.TAGS || '')
    .split(',')
    .map(item => item.trim())
    .join(' ');

if (tags.trim()) {
  common.push(`-t ${tags}"`);
}

module.exports = {
  cucumber: common.join(' ')
};
