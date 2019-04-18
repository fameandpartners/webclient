declare module 'react-infinite-scroller' {
    import { Component } from 'react';
    interface InfiniteScrollProps {
        element?: React.ReactNode;
        hasMore?: boolean;
        initialLoad?: boolean;
        isReverse?: boolean;
        loader?: React.ReactNode;
        loadMore: () => void;
        pageStart?: number;
        ref?: () => void;
        threshold?: number;
        useCapture?: boolean | AddEventListenerOptions;
        useWindow?: boolean;
    }

    export default class InfiniteScroll extends Component<InfiniteScrollProps> {}
}
