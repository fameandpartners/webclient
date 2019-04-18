import React from 'react';

interface Props extends React.InputHTMLAttributes<any> {
    label?: string;
}

class Radio extends React.PureComponent<Props> {
    public render() {
        const { label } = this.props;

        return (
            <div className={'Radio'}>
                <style jsx>{`
                    @import 'vars';
                    
                    .Radio {
                        display: flex;
                        align-items: center;

                        label {
                            margin: 0 2*$space-base;
                            cursor: pointer;
                        }
                    }
                `}</style>
                <input type="radio" {...this.props} />
                {label ? <label>{label}</label> : null}
            </div>
        );
    }
}

export default Radio;
