import { Component } from 'react';
import { withRouter, SwitchProps, RouteComponentProps } from 'react-router';
import { BASEURL_DRESS_SYSTEM_SEARCH, BASEURL_SEARCH, BASEURL_CATEGORY_PAGES } from '@common/utils/url-helper';

const IGNORE_SCROLLS = [
    new RegExp(`^${BASEURL_DRESS_SYSTEM_SEARCH}`),
    new RegExp(`^${BASEURL_SEARCH}`),
    ...BASEURL_CATEGORY_PAGES.map((baseUrl) => new RegExp(`^${baseUrl}(?!/dress-|/custom-dress)`))
];

class ScrollToTop extends Component<RouteComponentProps<SwitchProps>> {
    public componentDidUpdate(prevProps: SwitchProps) {
        if (this.props.location && prevProps.location) {
            for (const url of IGNORE_SCROLLS) {
                if (url.test(this.props.location.pathname) && url.test(prevProps.location.pathname)) {
                    return;
                }
            }
        }

        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    public render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
