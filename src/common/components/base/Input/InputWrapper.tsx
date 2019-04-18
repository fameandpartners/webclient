import React from 'react';
import classnames from 'classnames';

export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: React.ReactNode;
    labelPosition?: 'left' | 'right';
    error?: boolean;
    inlineError?: React.ReactNode;
    inlineMeta?: React.ReactNode;
    id?: string;
}

class InputWrapper extends React.Component<InputWrapperProps> {
    public static defaultProps: Partial<InputWrapperProps> = {
        labelPosition: 'left',
    };

    public render() {
        const { error, inlineError, inlineMeta, label, labelPosition, className, id, children } = this.props;

        const showMeta = (inlineError && error) || (inlineMeta && !error);

        return (
            <div
                className={classnames('input-wrapper', className, {
                    'input-wrapper--error': error
                })}
            >
                <style jsx>{`
                    @import 'vars';

                    .input-wrapper {
                        width: 100%;

                        &--error {
                            .meta {
                                color: $color-red;
                            }
                        }
                    }

                    .meta {
                        padding:$space-base/2 0;
                    }

                    label {
                        display: block;
                        margin-bottom: 2*$space-base;
                        font-weight: bold;
                    }
                `}</style>
                
                {label && labelPosition === 'left' ? <label htmlFor={id}>{label}</label> : null}

                {children}

                {label && labelPosition === 'right' ? <label htmlFor={id}>{label}</label> : null}

                {showMeta && <div className={'meta'}>
                    {inlineMeta && !error && inlineMeta}
                    {inlineError && error && inlineError}
                </div>}
            </div>
        );
    }
}

export default InputWrapper;