import React from 'react';
import { CmsElement } from 'typings/cms';
import EmailCapture from '@components/layout/Footer/EmailCapture';
import { RouteComponentProps, withRouter } from 'react-router';
import { History } from 'history';
import { trackEmailCaptureSkipped } from '@common/analytics/analytics';
import { CmsPageGlobalConfig } from './CmsPageGlobalConfig';

interface Props extends RouteComponentProps<CmsElement> {
    buttonText: string;
    successRedirect: string | undefined;
    listId?: string;
    internalName: string;
    style: 'white' | 'black';

    pageConfig?: CmsPageGlobalConfig;
}

function redirect(history: History, url: string) {
    if (url.startsWith('/')) {
        history.push(url);
    } else {
        window.location.href = url;
    }
}

const EmailCaptureCms: React.SFC<Props> = ({ successRedirect, buttonText, listId, history, style, internalName, ...props }: Props) => {
    const onSuccess =  successRedirect
        ? () => {
            redirect(history, successRedirect);
            return false;
        }
        : undefined;

    const onSkip = successRedirect ?
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();

            trackEmailCaptureSkipped(internalName);

            redirect(history, successRedirect);
            return false;
        }
        : undefined;

    return <div className="EmailCaptureCms">
        <style jsx>{`
            @import 'vars';

            a {
                display: inline-block;
                margin-top: 2*$space-base;
            }
        `}</style>
            <EmailCapture buttonText={buttonText} listId={listId} onSignupSuccess={onSuccess} name={internalName} style={style} {...props} />
            {successRedirect && <a href={successRedirect} onClick={onSkip}>No Thanks, Skip</a>}
    </div>;
};

export default withRouter(EmailCaptureCms);
