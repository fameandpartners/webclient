import React from 'react';
import classnames from 'classnames';
import { isBrowser } from '@common/utils/server-client-helpers';
import ScrollListener from '@components/event-listener/ScrollListener';

interface Props {
    className?: string;
    onStickyClasses?: string;
    desktopOnly?: boolean;
    mobileOnly?: boolean;
    always?: boolean;
    noWrapper?: boolean;
}

interface State {
    isSticky: boolean;
}

class Sticky extends React.PureComponent<Props> {

    private _root = React.createRef<HTMLDivElement>();

    public state: State = {
        isSticky: this.isSticky(),
    };

    public static defaultProps: Partial<Props> = {
        desktopOnly: true,
    };

    private isSticky(): boolean {
        if (isBrowser() && this._root.current) {
            return this._root.current.getBoundingClientRect().top <= 56;
        }
        return  false; 
    }

    public render() {

        const { isSticky } = this.state;

        return (
            <div 
                ref={this._root}
                className={classnames('Sticky', {
                    [this.props.className!]: Boolean(this.props.className),
                    [this.props.onStickyClasses!]: isSticky && Boolean(this.props.onStickyClasses),
                    'Sticky--Desktop': this.props.desktopOnly,
                    'Sticky--Mobile': Boolean(this.props.mobileOnly),
                    'Sticky--All': Boolean(this.props.always),
                })}
            >
                <ScrollListener
                    onScroll={() => this.setState({ isSticky: this.isSticky() })}
                />
                <style jsx>{`
                    @import 'vars';

                    .Sticky {
                        &--Desktop {
                            @include desktop {
                                position: sticky;
                                top: $navbar-height;
                                z-index: $z-index-below-header;
                            }
                        }

                        &--Mobile {
                            @include mobile {
                                position: sticky;
                                top: $navbar-height;
                                z-index: $z-index-below-header;
                            }
                        }

                        &--All {
                            position: sticky;
                            top: $navbar-height;
                            z-index: $z-index-below-header;
                        }
                    }

                `}</style>
                {this.props.children}
            </div>
        );
    }
}

export default Sticky;
