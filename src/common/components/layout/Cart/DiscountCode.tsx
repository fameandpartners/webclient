import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames';
import Button from '@components/base/Button/Button';
import Input from '@components/base/Input/Input';
import InputWrapper from '@components/base/Input/InputWrapper';
import FameAPI from '@common/services/fameApi';
import { trackEmailCaptureCompleted } from '@common/analytics/analytics';
import { SiteVersion } from '@common/constants';

interface DiscountCodeState {
  couponCode?: string;
  codeApplyError: boolean;
  codeApplySuccess: boolean;
}

interface DiscountCodeProps {
  oncodeApplySuccess?: () => void;
  name: string;
  listId?: string;
  buttonText: string;
  style: 'black' | 'white' | 'default';
  slim?: boolean;
  siteVersion: SiteVersion;
}

class DiscountCode extends Component<DiscountCodeProps, DiscountCodeState> {
  private brontoSuccessNode: HTMLDivElement | null = null;

  public static defaultProps: Partial<DiscountCodeProps> = {
    style: 'default'
  };

  public state: DiscountCodeState = {
    couponCode: undefined,
    codeApplyError: false,
    codeApplySuccess: false
  };

  private handleInputCodeChange(value?: string) {
    this.setState({
      couponCode: value,
      codeApplyError: false
    });
  }

  private handleDiscountClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }


  private handleSuccess() {
    if (this.props.oncodeApplySuccess) {
      this.props.oncodeApplySuccess();
    }

    this.setState({
      codeApplySuccess: true
    });
  }

  public render() {
    const { codeApplyError, codeApplySuccess } = this.state;

    const showSuccess = codeApplySuccess && !this.props.oncodeApplySuccess;

    return (
      <div className={classnames('DiscountCode', { 'DiscountCode--slim': this.props.slim })}>
        <style jsx>{`
          @import 'vars';

          .DiscountCode {
            max-width: 750px;

            :global(.button) {
              height: 6 * $space-base;
            }

            :global(input) {
              height: 6 * $space-base;
              padding: 13px 16px;
            }

            &--slim {
              :global(.button) {
                height: 5 * $space-base;
              }

              :global(input) {
                height: 5 * $space-base;
                padding: 9px 16px 9px;
              }
            }
          }

          .DiscountCode :global(.discount-code-input) {
            width: 0;
            flex-grow: 1;
          }

          form {
            display: flex;
            align-items: start;

            :global(input.input--transparent) {
              border-right: none;

              &:hover,
              &:focus,
              &:active {
                border-color: $color-black;
              }
            }

            :global(.button) {
              height: 5 * $space-base;

              &:hover,
              &:focus,
              &:active {
                color: $color-white;
                border-color: $color-black;
                background-color: $color-black;
              }
            }

            :global(input.input--transparent.input--white) {
              &:hover,
              &:focus,
              &:active {
                border-color: $color-white;
              }
            }

            :global(.button:not(.Button--transparent-black)) {
              &:hover,
              &:focus,
              &:active {
                color: $color-black;
                border-color: $color-black;
                background-color: $color-white;
              }
            }
          }
        `}</style>
        {showSuccess && <h4>Apply success!</h4>}

        {!showSuccess && (
          <form onSubmit={(e) => this.handleDiscountClick(e)} noValidate={true}>
            <Input
              wrapperClassName="discount-code-input"
              placeholder="Discount code"
              type="text"
              error={codeApplyError}
              inlineError="Please enter a valid discount code..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleInputCodeChange(e.target.value)}
              transparent
              white={this.props.style === 'white'}
            />
            <Button transparentBlack={this.props.style === 'black'} transparent={this.props.style === 'white'}>
              {this.props.buttonText}
            </Button>
          </form>
        )}
        <div style={{ display: 'none' }} ref={(x) => (this.brontoSuccessNode = x)} />
      </div>
    );
  }
}

export default DiscountCode;
