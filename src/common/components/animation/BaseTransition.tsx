import React, { CSSProperties } from 'react';
import { Motion, PlainStyle, spring, SpringHelperConfig } from 'react-motion';

export interface BaseTransitionProps {
    isVisible: boolean;
    keepElementInDOM?: boolean;
    animateIn?: boolean;
    animateOut?: boolean;
    loop?: boolean;
    children: ((style: PlainStyle) => React.ReactElement<any>) | React.ReactNode;
    onAnimationFinished?: () => void;
    springConfig?: SpringHelperConfig;
}

interface BaseTransitionState {
    cachedChildren: ((style: CSSProperties) => React.ReactElement<any>) | React.ReactNode | null;
    loopCount: number;
    raf: number;
}

export default abstract class BaseTransition<Props extends BaseTransitionProps = BaseTransitionProps> extends React.PureComponent<Props, BaseTransitionState> {
    public static defaultProps = {
        animateIn: true,
        animateOut: true,
        loop: false,
    };

    public state: BaseTransitionState = {
        cachedChildren: (this.props.isVisible || this.props.keepElementInDOM) ? this.props.children : null,
        loopCount: 0,
        raf: 0,
    };

    public static getDerivedStateFromProps(nextProps: BaseTransitionProps, prevState: BaseTransitionState): Partial<BaseTransitionState> {
        if (nextProps.isVisible || nextProps.keepElementInDOM) {
            return { cachedChildren: nextProps.children };
        }
        
        if (!nextProps.isVisible && !nextProps.animateOut) {
            return { cachedChildren: null };
        }

        return {};
    }

    public componentWillUnmount() {
        cancelAnimationFrame(this.state.raf);
    }

    public onAnimationFinished() {
        if (!this.props.isVisible && !this.props.keepElementInDOM) {
            this.setState({ cachedChildren: null });
        }

        if (this.props.loop) {
            requestAnimationFrame(() => this.setState({ loopCount: this.state.loopCount + 1 }));
        }

        if (this.props.onAnimationFinished) {
            this.props.onAnimationFinished();
        }
    }

    protected formatStyles(styles: PlainStyle): CSSProperties {
        return styles;
    }

    protected abstract getDefaultStyle(): any;
    protected abstract getStyle(): any;

    public render() {
        const { cachedChildren } = this.state;

        let wrappedCachedChildren;

        if (cachedChildren == null) {
            wrappedCachedChildren = () => <React.Fragment>{null}</React.Fragment>;
        } else if (typeof cachedChildren === 'function') {
            wrappedCachedChildren = (styles: PlainStyle) => cachedChildren(this.formatStyles(styles));
        } else {
            wrappedCachedChildren = (style: PlainStyle) => <div className="transition-container" style={this.formatStyles(style)}>{cachedChildren}</div>;
        }

        return (
            <Motion
                onRest={() => this.onAnimationFinished()}
                defaultStyle={this.getDefaultStyle()}
                style={this.getStyle()}
            >
                {wrappedCachedChildren}
            </Motion>
        );
    }
}
