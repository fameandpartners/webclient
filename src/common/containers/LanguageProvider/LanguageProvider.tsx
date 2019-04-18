/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { SiteVersion } from '@common/constants';

interface Props {
    siteVersion: SiteVersion;
    messages: any;
}

class LanguageProvider extends React.PureComponent<Props> {
    public render() {
        return (
            <IntlProvider locale={this.props.siteVersion} key={this.props.siteVersion} messages={this.props.messages[this.props.siteVersion]}>
                {React.Children.only(this.props.children)}
            </IntlProvider>
        );
    }
}

export default LanguageProvider;
