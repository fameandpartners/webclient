import React from 'react';

class AspectRatio extends React.PureComponent<{ratio: number | null}> {
    public render() {
        const { ratio, children }  = this.props;

        if (!ratio) {
            return children;
        }

        return (
            <div className="AspectRatio">
                <style jsx>{`
                    .AspectRatio{
                        position: relative;
                        width: 100%;

                        > :global(*:nth-child(2)) {
                            position: absolute;
                            top: 0;
                            width: 100%;
                            height: 100%;
                        }
                    }

                    span {
                        display: block;
                        height: 0;
                        width: 0;
                    }
                `}</style>
                <span style={{paddingBottom: `${ratio * 100}%`}}/>
                {children}
            </div>
        );
    }
}

export default AspectRatio;
