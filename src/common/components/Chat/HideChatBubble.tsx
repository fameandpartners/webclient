import React from 'react';

class HideChatBubble extends React.PureComponent {
    public render() {
        return (
            <React.Fragment>
                <style jsx>{`
                    :global(.zopim[data-test-id="ChatWidgetButton"]) {
                        display: none;
                    }    
                `}</style>
            </React.Fragment>
        );
    }
}

export default HideChatBubble;