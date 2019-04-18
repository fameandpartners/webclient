import React from 'react';

interface Props {
    children: React.ReactNode;
}

class HoverableImage extends React.PureComponent<Props> {
    
    public render() {
        const { children } = this.props;

        return (
            <div className="HoverableImage">
                <style jsx>{`
                    .HoverableImage {
                        position: relative;

                        > :global(*:nth-child(2)) {
                            opacity: 0;

                            position: absolute !important;
                            top: 0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                        }
                        > :global(*:first-child) {
                            opacity: 1;
                        }

                        &:hover {
                            > :global(*:first-child) {
                                opacity: 0;
                            }
                            
                            > :global(*:nth-child(2)),
                            > :global(*:last-child) {
                                opacity: 1;
                            }
                        };
                    }
                `}</style>
            
                {children}
            </div>
        );
    }
}

export default HoverableImage;
