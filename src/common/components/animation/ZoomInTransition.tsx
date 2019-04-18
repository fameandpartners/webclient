import React, { CSSProperties } from 'react';
import { Motion, PlainStyle, spring } from 'react-motion';
import BaseTransition, { BaseTransitionProps } from '@components/animation/BaseTransition';

interface Props extends BaseTransitionProps {
    fromValue?: number;
    toValue?: number;
}

class ZoomInTransition extends BaseTransition<Props> {
    public static defaultProps = {
        fromValue: 0.98,
        toValue: 1,
        animateIn: true,
        animateOut: true,
        loop: false,
    };
    protected formatStyles(styles: PlainStyle): CSSProperties {
        const { transform, ...rest } = styles;
        return {
            ...rest,
            transform: `scale3d(${transform}, ${transform}, ${transform})`,
        };
    }

    protected getDefaultStyle() {
        const { fromValue, toValue } = this.props;

        const isOdd = this.state.loopCount % 2;
        
        return { transform: this.props.animateIn ? fromValue : toValue };
    }

    protected getStyle() {
        const { fromValue, toValue } = this.props;

        const isOdd = this.state.loopCount % 2;

        return {
            transform: spring(this.props.loop ? isOdd ? fromValue! : toValue! : this.props.isVisible ? toValue! : fromValue!, this.props.springConfig),
        };
    }
}

export default ZoomInTransition;