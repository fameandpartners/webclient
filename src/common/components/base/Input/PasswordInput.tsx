import React from 'react';
import Input, { InputProps } from '@components/base/Input/Input';
import Button from '@components/base/Button/Button';

const Eye = require('@svg/i-eye.svg').default;

interface Props extends InputProps {
    visibleOnMount?: boolean;
    value: string | number;

    onChange: (value: any) => void;
}

interface State {
    isVisible: boolean;
    inputType: 'password' | 'text';
}

class PasswordInput extends React.PureComponent<Props, State> {
    public state: State = {
        isVisible: Boolean(this.props.visibleOnMount),
        inputType: Boolean(this.props.visibleOnMount) ? 'text' : 'password',
    };

    private toggle() {
        const isVisible = !this.state.isVisible;
        this.setState({ isVisible, inputType: isVisible ? 'text' : 'password' });
    }

    public render() {
        const { visibleOnMount, value, onChange, ...inputProps } = this.props;
        const { inputType } = this.state;
        
        return (
            <div className={'PasswordInput'}>
                <style jsx>{`
                    .PasswordInput {
                        position: relative;

                        :global(svg) {
                            user-select: none;
                        }
                    }
                `}</style>
                <Input 
                    {...inputProps}
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                    type={inputType}
                />
                <Eye style={{ width: 16, height: 16, position: 'absolute', right: 16, top: 12, color: inputProps.transparent ? 'white' : 'black' }} onClick={() => this.toggle()} />
            </div>
        );
    }
}

export default PasswordInput;
