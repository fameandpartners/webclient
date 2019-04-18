import Curtain from '@components/base/Curtain';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import Input from '@components/base/Input/Input';
import { ProductMedia } from 'typings/product';
import { trackShared } from '@common/analytics/analytics';
import FadeInOutTransition from '@components/animation/FadeInOutTransition';
import { Helmet } from 'react-helmet';
import { createPortal } from 'react-dom';
import { isBrowser } from '@common/utils/server-client-helpers';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;
const InstagramIcon = require('@svg/i-instagram.svg').default;
const FacebookIcon = require('@svg/i-facebook.svg').default;
const TwitterIcon = require('@svg/i-twitter.svg').default;
const PinterestIcon = require('@svg/i-pinterest.svg').default;
const LinkIcon = require('@svg/i-link.svg').default;

interface Props {
    url: string;
    image: ProductMedia;
    onClose: () => void;
    isVisible: boolean;
    dressTitle?: React.ReactNode;
}

interface State {
    copied: boolean;
}

class ShareModal extends React.PureComponent<Props, State> {
    private portalRoot: HTMLElement | null = null;
    private el: HTMLDivElement | null = null;
    
    public state: State = {
        copied: false
    };

    constructor(props: Props) {
        super(props);

        if (isBrowser()) {
            this.portalRoot = window.document.getElementById('portal-root');
            this.el = window.document.createElement('div');
        }
    }

    public componentDidMount() {
        if (this.portalRoot && this.el) {
            this.portalRoot.appendChild(this.el);
        }
    }

    public componentWillUnmount() {
        if (this.portalRoot && this.el) {
            this.portalRoot.removeChild(this.el);
        }
    }

    protected copyToClipBoard(text: string) {
        trackShared(text, 'Copy Link');

        const textArea = document.createElement('textarea');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        textArea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`;
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            let successful = document.execCommand('copy');

            // Have a second pass attempt if the previous technique doesn't work
            // This is generally for iOS as it is a bit different
            if (!successful) {
                const range = document.createRange();
                range.selectNodeContents(textArea);

                const s = window.getSelection();
                s.removeAllRanges();
                s.addRange(range);

                textArea.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

                successful = document.execCommand('copy');
            }

            if (successful) {
                this.setState({ copied: true });

                setTimeout(() => this.setState({ copied: false }), 1000);
            } else {
                throw Error(`Unable to copy ${text}`);
            }
        } catch (err) {
            console.error('Unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }

    protected openPopup(url: string, page: string, platform: string) {
        trackShared(page, platform);

        window.open(url, 'popup', 'width=600,height=600');
        return false; 
    }

    private onClose() {
        this.setState({ copied: false });
        this.props.onClose();
    }

    public render() {
        if (!this.el || !this.portalRoot) {
            return null;
        }

        const icons = [
            {
              url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.props.url)}`,
              icon: <FacebookIcon style={{ width: 18, height: 18 }} />,
              title: 'Facebook',
            },
            {
              url: `http://twitter.com/share?url=${encodeURIComponent(this.props.url)}`,
              icon: <TwitterIcon style={{ width: 18, height: 18 }} />,
              title: 'Twitter',
            },
            {
              url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(this.props.url)}&media=${encodeURIComponent(this.props.image && this.props.image.src[0] && this.props.image.src[0].url)}&description=`,
              icon: <PinterestIcon style={{ width: 18, height: 18 }} />,
              title: 'Pinterest',
            }
          ];
 
        return createPortal(<React.Fragment>
            <style jsx>{`
                @import 'vars';

                .ShareModal__Wrapper {
                    z-index: $z-index-above-curtain;
                }

                .ShareModal {
                    width: 100%;
                    margin: 2*$space-base;
                    max-width: 420px;
                    background-color: $color-white;
                    box-shadow: 0 $space-base 12px 0 rgba($color-white, 0.08);
                    border-radius: 2px;
                    padding: 2*$space-base 6*$space-base;

                    @include mobile {
                        padding: 2*$space-base;
                    }

                    .ShareModal__CloseWrapper {
                        display: flex;
                        justify-content: flex-end;
                        margin:2*$space-base -2*$space-base 0 0;

                        @include mobile {
                            margin: 2*$space-base 0 0;
                        }
                    }

                    .ShareModal__Title {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        padding-bottom: 4*$space-base;

                        h4, p {
                            text-align: center;
                            flex-grow: 1;
                            margin-bottom: 0;
                        }

                        p {
                            @include text-style-title;
                        }
                    }
                    
                    .ShareModal__SocialIcons {
                        display: flex;
                        padding: 4*$space-base 0 2*$space-base 0;
                        justify-content: space-between;

                        li {
                            a {
                                display: flex;
                                align-items: center;
                                text-decoration: none;

                                :global(svg) {
                                    margin-right: $space-base;
                                }

                                &:hover, &:focus {
                                    text-decoration: underline;
                                }
                            }
                        }
                    }

                    .ShareModal__CopyButton {
                        margin-bottom: 4*$space-base;

                        :global(button) {
                            margin: 0 auto;
                            min-width: 188px;
                        }
                    }

                    .ShareModal__CopyInput {
                        position: relative;
                        padding: 4*$space-base 0;

                        :global(input) {
                            padding-left: 5*$space-base;
                        }

                        &--notification {
                            position: absolute;
                            top: 4*$space-base;
                            bottom: 4*$space-base;
                            left: 0;
                            right: 0;

                            color: white;

                            background-color: rgba(green, 0.9);

                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            `}</style>

            <Curtain centerChildren isVisible={this.props.isVisible} onClick={() => this.onClose()}>
                <div className="ShareModal__Wrapper">
                    <Helmet>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                    </Helmet>
                    <div className="ShareModal">
                        <KeyListener
                            options={[
                                {
                                    keyCode: KeyCodes.Esc,
                                    action: () => this.onClose(),
                                }
                            ]}
                        />
                        
                        <div className="ShareModal__CloseWrapper">
                            <a className="close" onClick={() => this.onClose()}><CloseCrossIcon style={{ width: 16, height: 16 }} /></a>
                        </div>

                        <div className="ShareModal__Title">
                            <p><FormattedMessage id="ShareModal.Title" defaultMessage="SHARE" /></p>
                            <h4>{this.props.dressTitle}</h4>
                        </div>

                        <ul className="ShareModal__SocialIcons">
                            {icons.map((icon) => <li key={icon.url}>
                                <a className="icon-text" href={icon.url} target="_blank" onClick={() => this.openPopup(icon.url, this.props.url, icon.title)}>
                                    {icon.icon}
                                    {icon.title}
                                </a>
                            </li>)}
                        </ul>

                        <div className="ShareModal__CopyInput">
                            <LinkIcon style={{ width: 16, height: 16, top: 44, left: 16, position: 'absolute' }} />
                            <Input
                                readOnly
                                value={this.props.url}
                                onClick={() => this.copyToClipBoard(this.props.url)}
                            />
                            <FadeInOutTransition isVisible={this.state.copied}>
                                <div className="ShareModal__CopyInput--notification"><FormattedMessage defaultMessage="The link has been copied successfully!" id="ShareModal.Input.Success" /></div>
                            </FadeInOutTransition>
                        </div>
                    </div>
                </div>
            </Curtain>
        </React.Fragment>,
        this.el);
    }
}

export default ShareModal;