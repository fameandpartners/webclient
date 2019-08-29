import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames';
import Button from '@components/base/Button/Button';
import Input from '@components/base/Input/Input';
import InputWrapper from '@components/base/Input/InputWrapper';
import FameAPI from '@common/services/fameApi';
import { trackEmailCaptureCompleted } from '@common/analytics/analytics';
import { SiteVersion } from '@common/constants';

interface EmailCaptureState {
  userEmail?: string;
  signupError: boolean;
  signupSuccess: boolean;
}

interface EmailCaptureProps {
  onSignupSuccess?: () => void;
  name: string;
  listId?: string;
  buttonText: string;
  style: 'black' | 'white' | 'default';
  slim?: boolean;
  siteVersion: SiteVersion;
}

export function isEmailValid(email?: string) {
  const re = /\S+@\S+\.\S+/;
  return email && re.test(email);
}

class EmailCapture extends Component<EmailCaptureProps, EmailCaptureState> {
  private brontoSuccessNode: HTMLDivElement | null = null;

  public static defaultProps: Partial<EmailCaptureProps> = {
    style: 'default'
  };

  public state: EmailCaptureState = {
    userEmail: undefined,
    signupError: false,
    signupSuccess: false
  };

  private handleInputEmailChange(value?: string) {
    this.setState({
      userEmail: value,
      signupError: false
    });
  }

  private handleSignupClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isEmailValid(this.state.userEmail)) {
      this.handleSubscribe();
    } else {
      this.setState({
        signupError: true
      });
    }
  }

  private async handleSubscribe() {
    // const { userEmail } = this.state;
    // let signUpUrl = `${global.__FAME_CONFIG__.NEWSLETTER_SIGNUP_URL}?q=direct_add&fn=Public_DirectAddForm&id=bdgojucscmxsxluwqpqutjwzwwfhbah&email=${encodeURIComponent(userEmail!)}&createCookie=1`;
    // if (this.props.listId) {
    //     signUpUrl = signUpUrl + `&list1=${this.props.listId}`;
    // }

    // const brontoImgEl = `<img src="${signUpUrl}" width="0" height="0" border="0" alt="" />`;

    // if (this.brontoSuccessNode) {
    //     this.brontoSuccessNode.innerHTML = brontoImgEl;
    //     trackEmailCaptureCompleted(this.props.name);
    //     this.handleSuccess();
    // }

    const fameApi = new FameAPI(this.props.siteVersion);
    try {
      const response: any = await fameApi.subscribeNewsletter({ email: this.state.userEmail });
      // At this point, identify
      const klaviyo = window._learnq || [];
      klaviyo.push([
        'identify',
        {
          $email: response.email,
          $first_name: response.firstName,
          $last_name: response.lastName
        }
      ]);
      this.handleSuccess();
    } catch (error) {
      console.log('--> error subscribe', error);
    }
  }

  private handleSuccess() {
    if (this.props.onSignupSuccess) {
      this.props.onSignupSuccess();
    }

    this.setState({
      signupSuccess: true
    });
  }

  public render() {
    const { signupError, signupSuccess } = this.state;

    const showSuccess = signupSuccess && !this.props.onSignupSuccess;

    return (
      <div className={classnames('EmailCapture', { 'EmailCapture--slim': this.props.slim })}>
        <style jsx>{`
          @import 'vars';

          .EmailCapture {
            max-width: 450px;

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

          .EmailCapture :global(.email-capture-input) {
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
        {showSuccess && <h4>Thanks for signing up!</h4>}

        {!showSuccess && (
          <form onSubmit={(e) => this.handleSignupClick(e)} noValidate={true}>
            <Input
              wrapperClassName="email-capture-input"
              placeholder="Enter your email address"
              type="email"
              error={signupError}
              inlineError="Please enter a valid email..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleInputEmailChange(e.target.value)}
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

export default EmailCapture;
