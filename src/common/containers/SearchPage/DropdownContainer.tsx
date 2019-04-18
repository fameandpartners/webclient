import ReactHoverObserver from 'react-hover-observer';
import React, { CSSProperties } from 'react';
import { spring, PlainStyle } from 'react-motion';
import BaseTransition from '@components/animation/BaseTransition';
import classnames from 'classnames';
class DropdownTransition extends BaseTransition {
    protected getDefaultStyle() {

        return {
            height: 0,
            opacity: 0
        };
    }

    protected getStyle() {
        return {
            height: spring(this.props.isVisible ? 0 : -10),
            opacity: spring(this.props.isVisible ? 1 : 0),
        };
    }
}

interface Props {
    trigger: React.ReactNode;
    animate: boolean;
    container: (style: CSSProperties) => React.ReactNode;
    containerStyle?: CSSProperties;
    hoverDelay?: number;
}

interface State {
    isHovering: boolean;
    isAnimating: boolean;
}

// tslint:disable max-classes-per-file
class DropdownContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isHovering: false,
            isAnimating: false
        };
    }

    private onHover = ({isHovering}: {isHovering: boolean}) => {
        this.setState((state): any => {
            if (isHovering && state.isAnimating) {
                return { };
            }
            return { isHovering, isAnimating: state.isHovering !== isHovering };
        });
    }

    private onClick = () => {
        this.setState((state): any => {
            return { isHovering: !state.isHovering, isAnimating: true };
        });
    }

    private renderContainer = (style: PlainStyle) => {
        return this.props.container({
            background: '#ffffff',
            ...(this.props.containerStyle || {}),
            opacity: style.opacity,
            transform: `translate3d(0, ${style.height || 0}%, 0)`,
            position: 'absolute',
            zIndex: 151
        });
    }

    private renderContainerWithOrWithoutAnimation = () => {
        const { isHovering } = this.state;

        if (this.props.animate) {
            return (
                <DropdownTransition isVisible={isHovering} onAnimationFinished={() => this.setState({isAnimating: false})} animateIn={false}>
                    {this.renderContainer} 
                </DropdownTransition>
            );
        } else {
            return isHovering ? this.renderContainer({opacity: 1, height: 0}) : null;
        }
    }

    public render() {
        const { isHovering } = this.state;
        const { trigger, hoverDelay } = this.props;

        return (
            <ReactHoverObserver hoverDelayInMs={hoverDelay || 150} hoverOffDelayInMs={hoverDelay || 150} onHoverChanged={this.onHover}>
                <span onClick={this.onClick} className={classnames({'DropdownContainer__Trigger--open': isHovering})}>{trigger}</span>
                {this.renderContainerWithOrWithoutAnimation()}
            </ReactHoverObserver>
        );
    }
}

export default DropdownContainer;