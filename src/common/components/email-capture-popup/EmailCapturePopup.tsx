import React from 'react';
import Cookies from 'universal-cookie';
import QueryString from 'query-string';

import Curtain from '@components/base/Curtain';
import { Helmet } from 'react-helmet';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import { FormattedMessage } from 'react-intl';
import EmailCapture from '@components/layout/Footer/EmailCapture';
import { UserRootState } from '@common/rematch/models/user';
import ZoomInTransition from '@components/animation/ZoomInTransition';
import FadeInOutTransition from '@components/animation/FadeInOutTransition';
import { isNode, isBrowser } from '@common/utils/server-client-helpers';
import IconButton from '@components/base/Button/IconButton';
import { SiteVersion } from '@common/constants';
import { RouteComponentProps, Switch, Route } from 'react-router';
import Button from '@components/base/Button/Button';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;
const FacebookIcon = require('@svg/i-facebook.svg').default;

type ViewState = 'default' | 'thank-you';

interface Props extends RouteComponentProps<{}> {
    user: UserRootState;
    siteVersion: SiteVersion;

    isVisible?: boolean;
    skipDelay?: boolean;
    forceShow?: boolean;

    popupTitle: string;
    popupSubtitle?: string;

    popupThankYouTitle: string;
    popupThankYouCode?: string;
    popupThankYouSubtitle?: string;

    emailCapture?: React.ReactElement<any>;
}

interface State {
    isVisible: boolean;
    isVisibleModal: boolean;
    setup: boolean;

    animated: boolean;
    viewState: ViewState;
}

const SS_NAME = 'user_popup_viewed';
const EXPIRE_TIME_IN_MONTHS = 6;
const MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30 * EXPIRE_TIME_IN_MONTHS;
const VIEW_STATE_QUERY_ID = 'ecp_view_state';
const FAME_AUTO_DISCOUNT_QUERY = 'faadc';

const TIMEOUT_VISIBLE_IN_MS = 8000;
const TIMEOUT_CONTENT_IN_MS = 100;

class EmailCapturePopup extends React.PureComponent<Props, State> {
    public state: State = {
        isVisible: Boolean(this.props.isVisible),
        isVisibleModal: Boolean(this.props.isVisible),
        animated: false,
        setup: false,
        viewState: this.getViewState(),
    };

    private getViewState() {
        const params = QueryString.parse(this.props.location.search);
        return params[VIEW_STATE_QUERY_ID] === 'thank-you' ? 'thank-you' : 'default';
    }

    private init() {
        // Business rule is:
        // 1. Only show to new users
        // 2. Triggered 8 seconds after load.
        // 3. Dismiss for session

        const cookies = new Cookies();

        // const ssItem = window.sessionStorage.getItem(SS_NAME);
        const shouldForceShow = this.state.viewState === 'thank-you' || Boolean(this.props.forceShow);
        const shown = cookies.get(SS_NAME) === 'true';

        if (isNode()) {
            return;
        }

        if (!shown || shouldForceShow) {
            setTimeout(() => {
                this.setState({ isVisible: true, setup: true });
                setTimeout(() => this.setState({ isVisibleModal: true }), TIMEOUT_CONTENT_IN_MS);
                // window.sessionStorage.setItem(SS_NAME, 'true');
                const currentDate = new Date();
                const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + EXPIRE_TIME_IN_MONTHS));
                cookies.set(SS_NAME, 'true', { path: '/', secure: process.env.NODE_ENV === 'production', maxAge: MAX_AGE_IN_SECONDS, expires: newDate });
            }, this.props.skipDelay || shouldForceShow ? 0 : TIMEOUT_VISIBLE_IN_MS);
        }
    }

    private onClose() {
        this.setState({ isVisibleModal: false, isVisible: false });

        this.removeThankYouUrl();
    }

    private getThankYouUrl(includeDomain?: boolean) {
        const query = QueryString.parse(this.props.history.location.search);
        query[VIEW_STATE_QUERY_ID] = 'thank-you';

        if (this.props.popupThankYouCode) {
            query[FAME_AUTO_DISCOUNT_QUERY] = this.props.popupThankYouCode;
        }

        return includeDomain ? `${window.location.href.replace(this.props.location.search, '')}?${QueryString.stringify(query)}${this.props.location.hash}` : `${this.props.location.pathname}?${QueryString.stringify(query)}`;
    }

    private removeThankYouUrl() {
        const query = QueryString.parse(this.props.history.location.search);

        if (VIEW_STATE_QUERY_ID in query) {
            delete query[VIEW_STATE_QUERY_ID];
        }

        this.props.history.push(`${this.props.location.pathname}?${QueryString.stringify(query)}`);
    }

    private onSubmit() {
        const newUrl = this.getThankYouUrl(false);
        this.props.history.push(newUrl);

        this.setState({ viewState: 'thank-you' });
    }

    private renderThankYou() {
        return (
            <div className={'EmailCaptureModal__Success'}>
                <style jsx>{`
                    @import 'vars';

                    .EmailCaptureModal__Success {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        height: calc(100% - #{4*$space-base} - #{2*$space-base});

                        p { margin: 0 }
                    }
                `}</style>

                <Helmet>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>

                {this.props.popupThankYouTitle && <h2>{this.props.popupThankYouTitle}</h2>}

                {this.props.popupThankYouCode && <p>Use code: {this.props.popupThankYouCode}</p>}

                {this.props.popupThankYouSubtitle && <p>{this.props.popupThankYouSubtitle}</p>}
            </div>
        );
    }

    private renderForm() {
        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .EmailCaptureModal__Title {
                        display: flex;
                        align-items: center;
                        flex-direction: column;

                        @include desktop {
                            padding-bottom: 3*$space-base;
                        }

                        h2, p {
                            text-align: center;
                            flex-grow: 1;
                        }

                        p {
                            @include text-style-title;

                            &:last {
                                margin-bottom: 4*$space-base;
                            }
                        }
                    }

                    .EmailCaptureModal__Form {
                        p {
                            margin: 2*$space-base 0;
                        }
                    }

                    .EmailCaptureModal__Footer {
                        text-align: center;
                        font-size: 12px;

                        @include desktop {
                            margin-top: 6*$space-base;
                        }
                    }
                `}</style>
                <div className="EmailCaptureModal__Title">
                    {this.props.popupTitle && <h2>{this.props.popupTitle}</h2>}

                    {this.props.popupSubtitle && <p>{this.props.popupSubtitle}</p>}
                </div>

                <div className="EmailCaptureModal__Form">
                    {this.props.emailCapture && React.cloneElement(this.props.emailCapture, { ...this.props.emailCapture.props, onSignupSuccess: () => this.onSubmit() })}
                    {!this.props.emailCapture && <EmailCapture name="Popup" buttonText="SUBMIT" onSignupSuccess={() => this.onSubmit()} />}

                    <p><FormattedMessage id="EmailCapturePopup.Seperator" defaultMessage="Or continue with" /></p>

                    <IconButton
                        icon={<FacebookIcon />}
                        facebook
                        white
                        fullwidth 
                        rel="nofollow"
                        url={`${global.__FAME_CONFIG__.URLS[this.props.siteVersion].api}/fb_auth?return_to=${encodeURI(this.getThankYouUrl(true))}`}
                    >
                        <FormattedMessage id={'EmailCapturePopup.Facebook'} defaultMessage={'Facebook'} />
                    </IconButton>
                </div>

                <div className="EmailCaptureModal__Footer">
                    <p>
                        <FormattedMessage 
                            id="EmailCapturePopup.Footer" 
                            defaultMessage="By providing your email address, you agree to our {privacyPolicy} and {tos}" 
                            values={{
                                privacyPolicy: <a href="/privacy">Privacy Policy</a>,
                                tos: <a href="/terms">Terms of Service</a>
                            }} 
                        />
                    </p>
                </div>
            </React.Fragment>
        );
    }

    private renderContent(fadeStyle: any) {
        return (
            (
                <React.Fragment>
                    <style jsx>{`
                        @import 'vars';
    
                        .EmailCaptureModal__Wrapper {
                            z-index: $z-index-above-curtain;
                        }
    
                        .EmailCaptureModal {
                            width: 100%;
                            margin: 2*$space-base;
                            background-color: $color-white;
                            box-shadow: 0 $space-base 12px 0 rgba($color-white, 0.08);
                            border-radius: 2px;
                            padding: 2*$space-base 6*$space-base;
                            text-align: center;
    
                            @include desktop {
                                min-height: 540px;
                                width: 420px;
                            }
    
                            @include mobile {
                                padding: 2*$space-base;
                                margin: 0;
                                height: 100vh;
                                max-width: 100vw;
                                width: 100vw;

                                :global(.EmailCapture) {
                                    max-width: 100vw;
                                }
                            }
    
                            .EmailCaptureModal__CloseWrapper {
                                display: flex;
                                justify-content: flex-end;
                                margin-right: space(-2);
                                
                                button { 
                                    border: none;
                                    padding: space(2);
                                }
    
                                @include mobile {
                                    margin: 2*$space-base 0 0;
                                }
                            }
                        }
                    `}</style>
                        <ZoomInTransition isVisible={this.state.isVisibleModal}>
                        {(style) =>
                            <div className="EmailCaptureModal__Wrapper" style={{ ...style, ...fadeStyle }}>
                                <Helmet>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                                </Helmet>
                                <div className={'EmailCaptureModal'}>
                                    <KeyListener
                                        options={[
                                            {
                                                keyCode: KeyCodes.Esc,
                                                action: () => this.onClose(),
                                            }
                                        ]}
                                    />

                                    <div className="EmailCaptureModal__CloseWrapper">
                                        <Button noBorder transparentBlack className="close" onClick={() => this.onClose()}><CloseCrossIcon style={{ width: 16, height: 16 }} /></Button>
                                    </div>

                                    {this.state.viewState === 'default' && this.renderForm()}
                                    {this.state.viewState === 'thank-you' && this.renderThankYou()}
                                    
                                </div>
                            </div>}
                        </ZoomInTransition>
                </React.Fragment>
            )
        );
    }

    public render() {
        if (!this.state.setup) {
            this.init();
        }

        return (
            <Curtain centerChildren isVisible={this.state.isVisible} onClick={() => this.onClose()}>
                <FadeInOutTransition isVisible={this.state.isVisibleModal} fromValue={.8} onAnimationFinished={() => this.setState({ animated: !this.state.isVisibleModal })}>
                    {(fadeStyle) => this.renderContent(fadeStyle)}
                </FadeInOutTransition>
            </Curtain>
        );
    }
}

export default EmailCapturePopup;
