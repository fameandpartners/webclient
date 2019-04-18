import React, { TouchEvent, Touch } from 'react';

export enum DragDirection {
    Left = 'left',
    Right = 'right',
}

export interface DragPosition {
    x: number;
    y: number;
    direction: DragDirection;
}

interface Props {
    element?: Element | null;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onTouch?: () => void;
    onDrag?: (dragPosition: DragPosition | null) => void;
}

interface State {
    previousTouchX: number;
    startX: number;
    startY: number;
    startTime: number;
    isLeftSwipe: boolean;
    isRightSwipe: boolean;
    isDragging: boolean;
}

const INITIAL_STATE: State = {
    previousTouchX: 0,
    startX: 0,
    startY: 0,
    startTime: 0,
    isLeftSwipe: false,
    isRightSwipe: false,
    isDragging: false,
};

class TouchListener extends React.Component<Props> {
    // Require at least a movement of 'x' in order to register as a drag event
    private static DRAG_SENSITIVITY = 80;

    // Require at least x milliseconds to elapse whilst the touch event is held to register as a drag event
    private static DRAG_TIME_DELTA_IN_MILLISECONDS = 100;

    public state: State = INITIAL_STATE;

    constructor(props: Props) {
        super(props);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    private resetState() {
        this.setState(INITIAL_STATE);
    }

    private resetDrag() {
        if (this.props.onDrag) {
            this.props.onDrag(null);
        }
    }
    
    public componentDidMount() {
        this.attach();
    }

    public componentWillUnmount() {
        this.detach();
    }

    public componentWillReceiveProps() {
        this.detach();
        this.attach();
    }

    private attach() {
        const domNode = this.props.element || window.document;
        domNode.addEventListener('touchstart', this.onTouchStart, false);
        domNode.addEventListener('touchmove', this.onTouchMove, false);
        domNode.addEventListener('touchend', this.onTouchEnd, false);
    }

    private detach() {
        window.document.removeEventListener('touchstart', this.onTouchStart);
        window.document.removeEventListener('touchmove', this.onTouchMove);
        window.document.removeEventListener('touchend', this.onTouchEnd);

        if (this.props.element) {
            this.props.element.removeEventListener('touchstart', this.onTouchStart);
            this.props.element.removeEventListener('touchmove', this.onTouchMove);
            this.props.element.removeEventListener('touchend', this.onTouchEnd);
        }
    }

    private onTouchStart(e: any) {
        if (this.state.startX === 0) {
            const event = e as TouchEvent<any>;
            const touch: Touch = event.touches[0];
    
            this.setState({ 
                startX: touch.clientX, 
                startY: touch.clientY,
                startTime: new Date().getTime(),
            });
        }
    }

    private onTouchMove(e: any) {
        const event = e as TouchEvent<any>;
        const touch: Touch = event.touches[0];
        
        if (touch.clientX < this.state.previousTouchX && !this.state.isLeftSwipe) {
            this.setState({ isLeftSwipe: true, isRightSwipe: false });
        } else if (touch.clientX > this.state.previousTouchX && !this.state.isRightSwipe) {
            this.setState({ isRightSwipe: true, isSwipeLeft: false });
        }

        this.setState({ previousTouchX: touch.clientX });

        if (this.props.onDrag) {
            const diffX = touch.clientX - this.state.startX;
            const absDiffX = Math.abs(diffX);

            const diffY = touch.clientY - this.state.startY;
            const absDiffY = Math.abs(diffY);

            const currTime = new Date().getTime();
            const deltaTime = currTime - this.state.startTime;

            if (absDiffX > TouchListener.DRAG_SENSITIVITY && deltaTime >= TouchListener.DRAG_TIME_DELTA_IN_MILLISECONDS) {
                this.setState({ isDragging: true });

                this.props.onDrag({
                    x: absDiffX,
                    y: absDiffY,
                    direction: diffX >= 0 ? DragDirection.Left : DragDirection.Right,
                });
            }
        }
    }

    private onTouchEnd(e: any) {
        const sendNonDragEvent = !this.state.isDragging;

        if (sendNonDragEvent) {
            if (this.state.isLeftSwipe) {
                if (this.props.onSwipeLeft) {
                    this.props.onSwipeLeft();
                }
            } else if (this.state.isRightSwipe) {
                if (this.props.onSwipeRight) {
                    this.props.onSwipeRight();
                }
            } else {
                if (this.props.onTouch) {
                    this.props.onTouch();
                }
            }
        }

        this.resetState();
        this.resetDrag();
    }

    public render() {
        return <div />;
    }
}

export default TouchListener;
