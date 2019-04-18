import React from 'react';
import { RootState } from '@common/rematch';
import { connect } from 'react-redux';
import { CmsPageGlobalConfig, CmsNavigationLink } from '@components/cms/CmsPageGlobalConfig';
import { CmsElementState } from '@common/rematch/models/cms';
import { isBrowser } from '@common/utils/server-client-helpers';
import { getReactComponentClassForCmsName } from '@components/cms/registry';
import queryString from 'query-string';
import { CmsElement } from 'typings/cms';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps<{}> {
    pageConfig?: CmsElementState<CmsPageGlobalConfig>;
}

interface State {
    currentPageUtmSource?: string;
    currentUrl?: string;
    setup?: boolean;
}

class GlobalEmailCapturePopup extends React.Component<Props, State> {
    public state: Partial<State> = {
        currentUrl: isBrowser() ? window.location.href : '',
        setup: false,
    };

    public componentDidMount() {
        this.init();
    }

    private init() {
        if (this.state.setup && this.state.currentUrl === window.location.href) {
            return false;
        }

        if (!this.props.pageConfig ||
            !this.props.pageConfig.element ||
            !this.props.pageConfig.element.emailCaptureSettings) {
            return false;
        }

        const { components } = this.props.pageConfig.element.emailCaptureSettings;

        if (!components || !Array.isArray(components) || components.length === 0) {
            return false;
        }

        const utm = queryString.parse(this.props.location.search).utm_source;

        if (this.state.currentPageUtmSource &&
            (this.state.currentPageUtmSource === utm)) {
            return false;
        }

        this.setState({ currentPageUtmSource: utm, currentUrl: window.location.href, setup: true });
        return utm ? components.some((x: any) => x.utmSource && x.utmSource.includes(utm)) : true;
    }

    private transformCmsElementToReactElement(object: CmsElement): React.ReactNode {
        const mapping = getReactComponentClassForCmsName(object.type);

        return React.createElement(mapping.component, {
            ...object,
            key: object.id,
            emailCapture: (object as any).emailCapture ? this.transformCmsElementToReactElement((object as any).emailCapture) : undefined,
        });
    }

    public render() {
        if (!this.state.setup) {
            return null;
        }

        if (!this.props.pageConfig ||
            !this.props.pageConfig.element ||
            !this.props.pageConfig.element.emailCaptureSettings) {
                return null;
            }

        if (this.props.pageConfig.element.emailCaptureSettings.ignoredUrls.links
                .some(
                    (x: CmsNavigationLink) => this.props.location.pathname.includes(x.url)
                )
            ) {
            return null;
        }

        const { components } = this.props.pageConfig.element.emailCaptureSettings;

        const currentPageUtmSource = queryString.parse(this.props.location.search).utm_source;
        const visibleComponentObject = currentPageUtmSource ? components.filter((x: any) => x.utmSource && x.utmSource.includes(currentPageUtmSource)).first() : components.filter((x: any) => !x.utmSource).first();

        if (!visibleComponentObject) {
            return null;
        }

        return <React.Fragment>{this.transformCmsElementToReactElement(visibleComponentObject)}</React.Fragment>;
    }
}

const mapStateToProps = (state: RootState) => ({
    pageConfig: state.CmsModel.elements.find((x) => x.slug === 'global-page'),
});

export default withRouter(connect(mapStateToProps)(GlobalEmailCapturePopup));
