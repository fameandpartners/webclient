import React from 'react';
import { KeyCodes } from '@common/utils/key-codes';
import { debounce } from '@common/utils/performance';
import { Timer } from 'typings/timer';
import { DELAY_KEYLISTENER_IN_MS } from '@common/constants';

interface Props {
    element?: Element | null;
    options?: Array<{
        keyCode: KeyCodes,
        action: () => void,
    }>;
}

interface State {
    attached: boolean;
    debounceHander?: Timer | null;
}

class KeyListener extends React.PureComponent<Props, State> {

    public state: State = {
        attached: false,
        debounceHander: null,
    };

    public componentDidUpdate(prevProps: Props) {
        const validElement = this.props.element instanceof Element || this.props.element === undefined;
        if (prevProps.element !== this.props.element && validElement && !this.state.attached) {
            this.detach();
            this.attach();
        }
    }

    private keyToCode(key: string) {
        switch (key) {
            case 'Left': return KeyCodes.Left;
            case 'Right': return KeyCodes.Right;
            case 'Up': return KeyCodes.Up;
            case 'Down': return KeyCodes.Down;
            case 'Esc': return KeyCodes.Esc;
            case 'Enter': return KeyCodes.Return;
            case 'Del': return KeyCodes.Delete;
            case 'ArrowLeft': return KeyCodes.Left;
            case 'ArrowRight': return KeyCodes.Right;
            case 'ArrowUp': return KeyCodes.Up;
            case 'ArrowDown': return KeyCodes.Down;
            case 'Escape': return KeyCodes.Esc;
            case 'Delete': return KeyCodes.Delete;
            default: return null;
        }
    }
    
    public componentDidMount() {
        // Don't attach if we are waiting for a DOM ref
        if (this.props.element instanceof Element || this.props.element === undefined) {
            this.attach();
        }
    }

    public componentWillUnmount() {
        this.detach();
    }

    private debounceFn = (e: any) => {
        return debounce(
            DELAY_KEYLISTENER_IN_MS, 
            () => this.onKeyUp(e), 
            (debounceHander?: Timer | null) => this.setState({ debounceHander }),
            this.state.debounceHander,
        );
    }

    private attach() {
        if (this.state.attached) {
            return;
        }

        const domNode = this.props.element || window.document;
        domNode.addEventListener(
            'keydown', 
            this.debounceFn, 
            { passive: true }
        );

        this.setState({ attached: true });

        // Focus the element so we can use it
        if (domNode instanceof HTMLElement) {
            domNode.focus();
        }
    }

    private detach() {
        const domNode = this.props.element || window.document;
        domNode.removeEventListener('keydown', this.debounceFn);

        this.setState({ attached: false });
    }

    private onKeyUp = (e: any) => {
        const event = e as KeyboardEvent;
        const { options } = this.props;
        if (!options) {
            return;
        }

        // Handle the event if a prop is given with this keycode
        const handler = options.find((x) => (x.keyCode === event.code) || (x.keyCode === this.keyToCode(event.key)));

        if (handler) {
            handler.action();
        }
    }

    public render() {
        return null;
    }
}

export default KeyListener;
