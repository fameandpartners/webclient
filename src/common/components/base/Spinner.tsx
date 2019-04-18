import React from 'react';
import classnames from 'classnames';

interface Props {
    width: number;
    height: number;
    color?: 'black' | 'white' | 'grey79' | 'grey47' | 'grey60';
}

class Spinner extends React.PureComponent<Props> {
    public render() {
        return <div 
                className={classnames(
                    'spinner',
                    {
                        'spinner--black': this.props.color === 'black',
                        'spinner--grey47': this.props.color === 'grey47',
                        'spinner--grey79': this.props.color === 'grey79',
                        'spinner--grey60': this.props.color === 'grey60'
                })}
                style={{width: this.props.width, height: this.props.height}}
        >
            <style jsx>{`
                @import 'vars';
                
                @keyframes spin {
                    from {transform:rotate(0deg);}
                    to {transform:rotate(360deg);}
                }

                .spinner {
                    border-radius: 50%;
                    border: 1px solid $color-white;
                    border-bottom-color: transparent;
                    border-right-color: transparent;
                    animation: spin 0.7s infinite linear;

                    &--black {
                        border-color: $color-black;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                    }

                    &--grey79 {
                        border-color: $color-grey79;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                    }

                    &--grey47 {
                        border-color: $color-grey47;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                    }

                    &--grey60 {
                        border-color: $color-grey60;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                    }
                }
            `}</style>
        </div>;
    }
}

export default Spinner;