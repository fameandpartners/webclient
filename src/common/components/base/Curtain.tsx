// https://codepen.io/gaearon/pen/yzMaBd
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';

import FadeInOutTransition from '@components/animation/FadeInOutTransition';
import { isBrowser } from '@common/utils/server-client-helpers';
import BodyLock from '@components/base/BodyLock';

interface Props {
    isVisible: boolean;
    style?: CSSProperties;

    padNavbar?: boolean;
    centerChildren?: boolean;

    onClick?: () => void;
}

class Curtain extends React.PureComponent<Props> {
    private portalRoot: HTMLElement | null = null;
    private el: HTMLDivElement | null = null;

    private _root = React.createRef<HTMLDivElement>();
    
    constructor(props: Props) {
        super(props);

        if (isBrowser()) {
            const portalRootId = 'STORYBOOK_ENV' in window ? 'root' : 'portal-root';
            this.portalRoot = window.document.getElementById(portalRootId);
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

    public render() {
        if (!this.el || !this.portalRoot) {
            return null;
        }

        return createPortal(
            <React.Fragment>
                <FadeInOutTransition isVisible={this.props.isVisible}>
                    { (styles) => (
                        <div
                            ref={this._root}
                            className={classnames('curtain', { 'center-children': this.props.centerChildren })}
                            style={{
                                opacity: styles.opacity,
                                ...this.props.style
                            }}
                        >
                            <style jsx>{`
                                @import 'vars';
                                .curtain {
                                    position: fixed;
                                    top: ${this.props.padNavbar ? 56 : 0}px;
                                    right: 0;
                                    bottom: 0;
                                    left: 0;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    z-index: $z-index-curtain;

                                    &.center-children {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    }
                                }
                            `}</style>

                            <BodyLock isVisible={this.props.isVisible} isHeader={this.props.padNavbar} onEscape={this.props.onClick}>
                                {this.props.children}
                            </BodyLock>
                        </div>
                    )}
                </FadeInOutTransition>
            </React.Fragment>,
            this.el,
        );
    }
}

export default Curtain;
