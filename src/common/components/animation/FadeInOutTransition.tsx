import React from 'react';
import { Motion, PlainStyle, spring } from 'react-motion';
import BaseTransition, { BaseTransitionProps } from '@components/animation/BaseTransition';

interface Props extends BaseTransitionProps {
    fromValue?: number;
    toValue?: number;
}

class FadeInOutTransition extends BaseTransition<Props> {
    public static defaultProps = {
        fromValue: 0,
        toValue: 1,
        animateIn: true,
        animateOut: true,
        loop: false,
    };

    protected getDefaultStyle() {
        const { fromValue, toValue } = this.props;

        const isOdd = this.state.loopCount % 2;

        return {
            // opacity: this.props.loop ? isOdd ? toValue : fromValue : this.props.animateIn ? fromValue : toValue,
            opacity: this.props.loop ? fromValue : this.props.animateIn ? fromValue : toValue,
        };
    }

    protected getStyle() {
        const { fromValue, toValue } = this.props;

        const isOdd = this.state.loopCount % 2;

        return {
            opacity: spring(this.props.loop ? isOdd ? fromValue! : toValue! : this.props.isVisible ? toValue! : fromValue!, this.props.springConfig),
        };
    }
}

export default FadeInOutTransition;