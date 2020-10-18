import { $ } from '../utils';

export class GooglePage {
    url() {
        return 'http://google.com'
    }
    searchBox() {
        return $('input[name="q"]');
    }

    firstSearchResult() {
        return $('#rso').find('a');
    }
};
