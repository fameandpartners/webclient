declare module 'react-showdown' {
    import { Component } from 'react';
    interface ReactShowDownMarkup {
        markdown: string;
        tables?: boolean;
    }

    export class Markdown extends Component<ReactShowDownMarkup> {}
}
