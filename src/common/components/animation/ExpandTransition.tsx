import React from 'react';
import { spring } from 'react-motion';
import BaseTransition, { BaseTransitionProps } from '@components/animation/BaseTransition';

interface Props extends BaseTransitionProps {
    width?: number;
}

export default class ExpandTransition extends BaseTransition<Props> {

    public static defaultProps = {
        width: 150,
        animateIn: true,
        animateOut: true,
        loop: false,
    };

    protected getDefaultStyle() {
        return {
            width: this.props.animateIn ? 0 : this.props.width!
        };
    }

    protected getStyle() {
        const isOdd = this.state.loopCount % 2;
        const shouldReverse = this.props.loop && isOdd;

        return {
            width: spring(this.props.isVisible ? (shouldReverse ? 0 : this.props.width!) : 0)
        };
    }
}
