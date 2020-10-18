import { cwd } from 'process';
import { homedir } from 'os';

/**
 * Default Browser
 */
const DEFAULT_BROWSER = 'chrome';

/**
 * Path-Information
 *  - home directory
 *  - current working directory
 */
const DEFAULT_HOME = homedir(); // /home/<usr>
const DEFAULT_CWD = cwd();

/**
 * Exported environment variables
 */
export const LOCALE = process.env.LOCALE || 'en';
export const BROWSER = process.env.BROWSER || DEFAULT_BROWSER;

export const GENERATE_CUCUMBER_HTML_REPORT = process.env.GENERATE_HTML_REPORT !== 'false';
export const GENERATE_CUCUMBER_JUNIT_REPORT = process.env.GENERATE_JUNIT_REPORT !== 'false';

const DEFAULT_BASE_URL = 'http://localhost:4300';
export const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;