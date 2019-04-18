declare module 'react-hover-observer' {
    import { Component, SyntheticEvent } from 'react';

    interface MouseHoverEvent {
        e: SyntheticEvent;
        setIsHovering: ()=>void;
        unsetIsHovering: ()=>void;
    }

    interface ReactHoverObserverProps {
        className?: string;
        hoverDelayInMs?: number;
        hoverOffDelayInMs?: number;
        onHoverChanged?: (event: {isHovering: boolean})=>void;
        shouldDecorateChildren?: boolean;
        onMouseEnter?: (e: MouseHoverEvent)=>void;
        onMouseLeave?: (e: MouseHoverEvent)=>void;
        onMouseOver?: (e: MouseHoverEvent)=>void;
        onMouseOut?: (e: MouseHoverEvent)=>void;
    }

    export default class ReactHoverObserver extends Component<ReactHoverObserverProps> {}
}
