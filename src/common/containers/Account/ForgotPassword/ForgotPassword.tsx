import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { SiteVersion } from '@common/constants';
import { objectFitPolyfill } from '@common/../client/polyfill/object-fit';
import Input from '@components/base/Input/Input';
import Button from '@components/base/Button/Button';
import PasswordInput from '@components/base/Input/PasswordInput';
import { UserRootState } from '@common/rematch/models/user';
import { isEmailValid } from '@components/layout/Footer/EmailCapture';
import AccountLayout from '@containers/Account/AccountLayout';
import { Link } from 'react-router-dom';

const SignupImage = require('@common/assets/jpg/signup.jpg');

type ForgotPasswordViewStates = 'email-sent' | 'password-changed' | 'token';

interface Props extends RouteComponentProps<{ viewState?: ForgotPasswordViewStates, token?: string }> {
    user: UserRootState;
    siteVersion: SiteVersion;

    sendResetPasswordEmail: (email: string) => void;
    resetPassword: (payload: { token: string, password: string }) => void;
}

interface State {
    email: string;
    password: string;
    passwordConfirmation: string;

    error: boolean;
    submitting: boolean;
}

class ForgotPassword extends React.PureComponent<Props, State> {
    public state: State = {
        email: '',
        password: '',
        passwordConfirmation: '',
        error: false,
        submitting: false,
    };

    public componentDidMount() {
        objectFitPolyfill();
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.props.user && this.props.user.forgotPasswordEmailSent && this.props.match.params.viewState !== 'email-sent') {
            this.props.history.push('/account/forgot-password/email-sent');
        } else if (this.props.user && this.props.user.passwordChanged && this.props.match.params.viewState !== 'password-changed') {
            this.props.history.push('/account/forgot-password/password-changed');
        }

        const hasError = this.props.user && this.props.user.error;

        if (hasError && !prevProps.user || hasError && (prevProps.user && !prevProps.user.error)) {
            this.setState({ error: true, submitting: false });
        }
    }

    private submitEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const { email } = this.state;

        if (isEmailValid(email)) {
            this.setState({ submitting: true, error: false });
            this.props.sendResetPasswordEmail(email);
        } else {
            this.setState({ error: true, submitting: false });
        }
    }

    private submitPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const { token } = this.props.match.params;
        const { password, passwordConfirmation } = this.state;

        if (!password || password !== passwordConfirmation) {
            this.setState({ error: true, submitting: false });
        } else if (token) {
            this.setState({ submitting: true, error: false });
            this.props.resetPassword({ token, password });
        }
    }

    private renderEmailSent() {
        return (
            <div>
                <FormattedMessage id={'Account.ForgotPassword.EmailSent'} defaultMessage={'You will receive an email with instructions about how to reset your password in a few minutes.'} />
            </div>
        );
    }

    private renderPasswordChanged() {
        return <Redirect exact to="/" />;
    }

    private renderEmailForm() {
        return (
            <React.Fragment>
                <div className={'form-header'}>
                    {/* <p>
                        <FormattedMessage 
                            id={'Account.Signup.ExistingAccount'} 
                            defaultMessage={'Already have an account? {createLink}'} 
                            values={{
                                createLink: <Link to="/account/login">Sign in here</Link>
                            }}
                        />
                    </p> */}
                    <p>
                        <FormattedMessage 
                            id={'Account.Login.NoAccount'} 
                            defaultMessage={'Don\'t have an account yet? {createLink}'} 
                            values={{
                                createLink: <Link to="/account/signup">Create a new account</Link>
                            }}
                        />
                    </p>
                    {this.state.error && <p className={'error'}><FormattedMessage id={'Account.ForgotPassword.Email.ErrorMessage'} defaultMessage={'Please ensure your email is correct'} /></p>}
                </div>
                <form 
                    onSubmit={(e) => this.submitEmail(e)} 
                    noValidate
                >
                    <Input 
                        name={'email'}
                        type={'email'}
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value, error: false, submitting: false })}
                        placeholder={'Email'}
                    />

                    <Button fullwidth spinner={this.state.submitting}><FormattedMessage id={'Account.ForgotPassword.Button'} defaultMessage={'Submit'} /></Button>
                </form>
            </React.Fragment>
        );
    }

    private renderPasswordForm() {
        return (
            <form 
                onSubmit={(e) => this.submitPassword(e)} 
                noValidate
            >
                {this.state.error && <p className={'error'}><FormattedMessage id={'Account.ForgotPassword.Password.ErrorMessage'} defaultMessage={'Please ensure your passwords are matching'} /></p>}

                <PasswordInput 
                    name={'password'}
                    value={this.state.password}
                    onChange={(v) => this.setState({ password: v })}
                    placeholder={'Password'}
                />
                <PasswordInput 
                    name={'passwordConfirmation'}
                    value={this.state.passwordConfirmation}
                    onChange={(v) => this.setState({ passwordConfirmation: v })}
                    placeholder={'Password Confirmation'}
                />

                <Button fullwidth spinner={this.state.submitting}><FormattedMessage id={'Account.ForgotPassword.Button'} defaultMessage={'Submit'} /></Button>
            </form>
        );
    }

    public render() {
        const { viewState, token } = this.props.match.params;

        return (
            <AccountLayout
                messageContent={null}
                imageContent={<img src={SignupImage} data-object-fit="cover" />}
                formContent={
                    <React.Fragment>
                        <div className={'form-header'}>
                            <h1><FormattedMessage id={'Account.ForgotPassword.Title'} defaultMessage={'Forgotten Password'} /></h1>
                        </div>

                        {!viewState && !token && this.renderEmailForm()}
                        {viewState === 'email-sent' && this.renderEmailSent()}
                        {viewState === 'password-changed' && this.renderPasswordChanged()}
                        {viewState === 'token' && token && this.renderPasswordForm()}
                    </React.Fragment>
                }
            />
        );
    }
}

export default ForgotPassword;
