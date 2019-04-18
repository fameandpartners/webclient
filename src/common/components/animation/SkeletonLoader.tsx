import React from 'react';
import FadeInOutTransition from '@components/animation/FadeInOutTransition';

interface Props {
    height?: string;
    width?: string;
    extraStyles?: any;

    isLoading: boolean;
}

class SkeletonLoader extends React.PureComponent<Props> {
    public static defaultProps = {
        height: '100%',
        width: '100%',
    };

    public render() {
        return (
            <FadeInOutTransition 
                isVisible={this.props.isLoading} 
                loop={true}
                fromValue={0.3}
            >
                {(style) => (
                    <div 
                        className="SkeletonLoader"
                        style={{
                            ...style,
                            ...this.props.extraStyles,
                        }}
                    >
                        <style jsx>{`
                            @import 'vars';
                            .SkeletonLoader {
                                width: ${this.props.width};
                                height: ${this.props.height};
                                background-color: $color-grey79;
                                transition: 0.2s ease-in-out;
                            }
                        `}</style>
                    </div>
                )}
                
            </FadeInOutTransition>
        );
    }
}

export default SkeletonLoader;
