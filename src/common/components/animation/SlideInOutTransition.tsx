import React, { CSSProperties } from 'react';
import { PlainStyle, spring } from 'react-motion';
import BaseTransition, { BaseTransitionProps } from '@components/animation/BaseTransition';

interface Props extends BaseTransitionProps {
    slideInFrom: 'right' | 'left' | 'bottom' | 'top';
    negativeValue?: number;
    positiveValue?: number;
    noFade?: boolean;
}

export default class SlideInOutTransition extends BaseTransition<Props> {
    public static defaultProps = {
        animateIn: true,
        animateOut: true,
        loop: false,
        negativeValue: -100,
        positiveValue: 100,
    };

    protected getTranslate(reverse?: boolean) {
        const { slideInFrom, negativeValue, positiveValue } = this.props;

        const slidesInFromBottomOrRight = slideInFrom === 'bottom' || slideInFrom === 'right';

        return (slidesInFromBottomOrRight && !reverse) ? positiveValue! : negativeValue!;
    }

    protected formatStyles(styles: PlainStyle): CSSProperties {
        const { transform, ...rest } = styles;
        const { slideInFrom } = this.props;
        const slidesInVertical = slideInFrom === 'top' || slideInFrom === 'bottom';
        const translateFrom = slidesInVertical ? 'translateY' : 'translateX';

        return {
            ...rest,
            transform: `${translateFrom}(${transform}%)`
        };
    }

    protected getOpacityStyle() {
        return this.props.noFade ? 1 : 0;
    }
    
    protected getDefaultStyle() {
        return {
            opacity: this.props.animateIn ? this.getOpacityStyle() : 1,
            transform: this.props.animateIn ? this.getTranslate() : 0
        };
    }

    protected getStyle() {

        const isOdd = this.state.loopCount % 2;
        const shouldReverse = this.props.loop && isOdd;

        return {
            opacity: spring(this.props.isVisible ? (shouldReverse ? this.getOpacityStyle() : 1) : this.getOpacityStyle()),
            transform: spring(this.props.isVisible ? (shouldReverse ? this.getTranslate(true) : 0) : this.getTranslate())
        };
    }
}
