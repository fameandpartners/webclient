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
      return null;
      
    }
}

export default Curtain;
