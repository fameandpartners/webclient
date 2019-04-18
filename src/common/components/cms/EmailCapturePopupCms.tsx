import React from 'react';
import { CmsElement } from 'typings/cms';
import EmailCapturePopup from '@components/email-capture-popup';

export interface EmailCapturePopupCmsProps extends CmsElement {
    title: string;
    subtitle?: string;
    thankYouTitle: string;
    thankYouCode?: string;
    thankYouSubtitle?: string;

    skipDelay?: boolean;

    emailCapture?: React.ReactElement<any>;

    utmSource?: string;
    internalName?: string;
}

const EmailCapturePopupCms: React.SFC<EmailCapturePopupCmsProps> = ({ title, subtitle, thankYouTitle, thankYouSubtitle, thankYouCode, skipDelay, utmSource, internalName, emailCapture }: EmailCapturePopupCmsProps) => {

    return (
        <EmailCapturePopup
            popupTitle={title}
            popupSubtitle={subtitle}
            popupThankYouTitle={thankYouTitle}
            popupThankYouCode={thankYouCode}
            popupThankYouSubtitle={thankYouSubtitle}
            skipDelay={skipDelay}
            emailCapture={emailCapture}
        />
    );

};

export default EmailCapturePopupCms;