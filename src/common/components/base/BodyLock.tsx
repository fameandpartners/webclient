import React from 'react';
import { isNode } from '@common/utils/server-client-helpers';
import Locky from 'react-locky';

interface Props {
    isHeader?: boolean;
    isVisible: boolean;

    onEscape?: () => void;
}

class BodyLock extends React.PureComponent<Props> {
    private getGapWidth() {
        if (isNode() || !document.documentElement) {
            return 0;
        }

        const cs = window.getComputedStyle(document.body);
        const value = cs.marginRight;
        const offset = parseInt(value || '', 10) || 0;
        const documentWidth = document.documentElement.clientWidth;
        const windowWidth = window.innerWidth;
        return Math.max(0, windowWidth - documentWidth + offset);
    }

    private renderScrollLockStyle() {
        return (
            <React.Fragment>
                <style jsx global>{`
                    body {
                        overflow: hidden;
                        margin-right: ${this.getGapWidth()}px;
                    }

                    .react-locky {
                        -webkit-overflow-scrolling: touch;
                    }
                `}</style>
            </React.Fragment>
        );
    }

    private renderScrollLockStyleForHeader() {
        if (!this.props.isHeader) {
            return null;
        }
        return (
            <React.Fragment>
                <style jsx global>{`
                    header {
                        padding-right: ${this.getGapWidth()}px;
                    }
                `}</style>
            </React.Fragment>
        );
    }

    public render() {

        return (
            <React.Fragment>
                {this.renderScrollLockStyle()}
                {this.renderScrollLockStyleForHeader()}

                <Locky 
                    enabled={this.props.isVisible}
                    className={'react-locky'}
                    onEscape={this.props.onEscape}
                    events={{
                        keydown: false,
                        click: 'report-only',
                    }}
                >
                    {this.props.children}
                </Locky>
            </React.Fragment>
        );
        
    }
}

export default BodyLock;
