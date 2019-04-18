import React, { PureComponent, Ref } from 'react';
import classnames from 'classnames';
import InputWrapper from '@components/base/Input/InputWrapper';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    inlineError?: React.ReactNode;
    inlineMeta?: React.ReactNode;
    label?: string;
  }

class Textarea extends PureComponent<TextareaProps> {
    private root: HTMLTextAreaElement | null;

    constructor(props: TextareaProps) {
        super(props);
        this.root = null;
    }

    public focus() {
        if (this.root) {
            this.root.focus();
        }
    }

    public select() {
        if (this.root) {
            this.root.select();
        }
    }

    public render() {
        const {
            error,
            inlineError,
            inlineMeta,
            label,
            className,
            ...taProps
        } = this.props;

        const {
            id
        } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import "vars";
                    textarea {
                        width: 100%;
                        min-height: space(10);
                        padding: 9px 16px 9px;
                        line-height: 16px;
                        font-size: 16px;
                        border: 1px solid $color-grey90;
                        font-family: inherit;

                        // Safari Fixes
                        border-radius: 0;
                        -webkit-appearance: none;

                        &:hover, &:active, &:focus {
                            border-color: $color-grey60;
                            outline: none;
                        }

                        &::placeholder {
                            @include text-style-form-placeholder;
                        }
                    }


                    .textarea--error {
                        border-color: $color-red;
                    }

                `}</style>

                <InputWrapper
                    inlineError={inlineError}
                    inlineMeta={inlineMeta}
                    error={error}
                    label={label}
                    id={id}
                >

                    <textarea
                        className={classnames(
                            className,
                            {
                            'textarea--error': error,
                            },
                        )}
                        {...taProps}
                    />
                </InputWrapper>
        </React.Fragment>);
    }
}

export default Textarea;
