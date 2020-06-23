import React, { PureComponent } from 'react';
import EmailCapture from './EmailCapture';
import SocialLinks from './SocialLinks';
import NavigationLink from '../NavigationLinks';
import { SiteVersion } from '@common/constants';
import { FormattedMessage } from 'react-intl';
import Select from '@components/base/Input/Select';
import InputWrapper from '@components/base/Input/InputWrapper';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

interface FooterProps {
    siteVersion: SiteVersion;
    pageConfig: CmsPageGlobalConfig;
    changeSiteVersion: (siteVersion: SiteVersion) => void;
}

class Footer extends PureComponent<FooterProps> {
    public render() {
        return (
            <footer>
              <div id="fd-form-5ece926bd832e40026fdb15e">
                {window.fd('form', {
                formId: '5ece926bd832e40026fdb15e',
                containerEl: '#fd-form-5ece926bd832e40026fdb15e'
              }});
              </div>
            </footer>
        );
    }
}

export default Footer;
