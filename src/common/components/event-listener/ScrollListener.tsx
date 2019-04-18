import React, { Component, createRef } from 'react';

interface Props {
    children?: null;
    onScroll?: () => void;
    onOutsideOfViewport?: ((scrolledPastElement: boolean) => void);
}

interface State {
    scrolledPastElement: boolean;
}

class ScrollListener extends React.PureComponent<Props, State> {
    protected elementRef = createRef<HTMLSpanElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            scrolledPastElement: false
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this.handleScroll();
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private handleScroll = () => {
        if (this.props.onScroll !== undefined) {
            this.props.onScroll();
        }

        const currentRef = this.elementRef.current;
        if (!currentRef) {
            return;
        }

        if (this.props.onOutsideOfViewport !== undefined) {
            const scrolledPastElement = currentRef.getBoundingClientRect().top <= 56;
            if (this.state.scrolledPastElement !== scrolledPastElement) {
                this.props.onOutsideOfViewport(scrolledPastElement);
                this.setState({ scrolledPastElement });
            }
        }
    }

    public render() {
        if (!this.props.onOutsideOfViewport) {
            return null;
        }
        
        return <span ref={this.elementRef} />;
    }
}

export default ScrollListener;
