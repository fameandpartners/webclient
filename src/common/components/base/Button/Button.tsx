import React from 'react';
import Spinner from '../Spinner';
import classnames from 'classnames';

export interface ButtonProps extends React.HTMLAttributes<any> {
  secondary?: boolean;
  tertiary?: boolean;
  quaternary?: boolean;
  normalCase?: boolean;
  fullwidth?: boolean;
  spinner?: boolean;
  formSelection?: boolean;
  transparent?: boolean;
  transparentBlack?: boolean;
  inline?: boolean;
  slim?: boolean;
  empty?: boolean;
  disabled?: boolean;
  noHover?: boolean;
  noBorder?: boolean;
  url?: string;
  target?: string;
  error?: boolean;
  errorText?: React.ReactNode;
  facebook?: boolean;
  rel?: string;
}

const Button: React.SFC<ButtonProps> = ({ className, children, secondary, tertiary, quaternary, normalCase, fullwidth, formSelection, slim, empty, disabled, noHover, noBorder, url, spinner, error, errorText, transparent, transparentBlack, inline, facebook, ...otherProps }) => {
  const classNames = classnames(
    'button',
    'Button',
    {
      'Button--secondary': secondary,
      'Button--tertiary': tertiary,
      'Button--quaternary': quaternary,
      'Button--normalCase': normalCase,
      'Button--form-selection': formSelection,
      'Button--fullwidth': fullwidth,
      'Button--slim': slim,
      'Button--empty': empty,
      'Button--disabled': disabled,
      'Button--no-hover': noHover,
      'Button--no-border': noBorder,
      'Button--transparent': transparent,
      'Button--transparent-black': transparentBlack,
      'Button--inline': inline,
      'Button--error': error,
      'Button--facebook': facebook
    },
    className
  );

  const childrenOrLoading = spinner ? <Spinner width={24} height={24} /> : children;

  return (
    <React.Fragment>
      <style jsx>{`
        @import 'vars';

        .Button {
          background-color: $color-grey14;
          color: $color-white;
          font-size: 13px;
          height: $button-height;
          padding: 0 2 * $space-base;
          margin: 0;
          border: 1px solid $color-black;
          line-height: 1;
          cursor: pointer;
          display: flex;
          outline: none;
          text-decoration: none;
          text-transform: uppercase;
          display: flex;
          justify-content: center;
          align-items: center;

          &:hover {
            color: $color-white;
            background-color: $color-grey20;
            text-decoration: none;
          }

          &--secondary {
            background-color: $color-white;
            color: $color-black;

            &:hover {
              background-color: $color-grey96;
              color: $color-black;
            }
          }

          &--form-selection {
            background-color: $color-white;
            color: $color-black;
            border-color: $color-grey90;

            &:hover,
            &:active,
            &:focus {
              border-color: $color-black;
            }
          }

          &--normalCase {
            text-transform: none;
          }

          &--fullwidth {
            width: 100%;
          }

          &--slim {
            font-size: 14px;
            height: 3 * $space-base;
          }

          &--empty {
            color: transparent;
            background: transparent;
            border-color: transparent;
            cursor: none;

            @include media('>tablet') {
              display: none;
            }
          }

          &--disabled {
            background-color: $color-grey96;
            cursor: not-allowed;
            color: $color-black;
          }

          &--transparent {
            color: $color-white;
            border-color: $color-white;
            background-color: transparent;

            &:hover,
            &:active,
            &:focus {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }

          &--transparent-black {
            color: $color-black;
            border-color: $color-black;
            background-color: transparent;

            &:hover,
            &:active,
            &:focus {
              background-color: $color-white;
              color: $color-black;
              border-color: $color-white;
            }
          }

          &--no-hover {
            &:hover,
            &:active,
            &:focus {
              background-color: $color-grey14;
            }
          }

          &--no-border {
            border: none;
            &:hover,
            &:active,
            &:focus {
              border: none;
            }
          }

          &--inline {
            display: inline-flex;
          }

          &--tertiary {
            background-color: $color-white;
            color: $color-grey60;

            &:hover {
              background-color: $color-grey96;
              color: $color-grey60;
            }
          }

          &--error {
            background-color: $color-red;
            color: $color-white;

            &.Button--secondary {
              background-color: $color-white;
              color: $color-red;
              border: 1px solid $color-red;
            }
          }

          &--facebook {
            background-color: $color-facebook;

            &:hover {
              background-color: lighten($color-facebook, 10%);
            }
          }
        }

        .error-text {
          @include text-style-form-option;
          display: block;
          color: $color-red;
          text-align: center;

          @include mobile {
            padding: 0 $page-padding-mobile;
          }
        }
      `}</style>
      {url ? (
        <a rel="noopener noreferrer" className={classNames} href={url} {...otherProps}>
          {childrenOrLoading}
        </a>
      ) : (
        <button disabled={spinner || disabled} className={classNames} {...otherProps}>
          {childrenOrLoading}
        </button>
      )}
      {error && errorText && <span className="error-text">{errorText}</span>}
    </React.Fragment>
  );
};

export default Button;
