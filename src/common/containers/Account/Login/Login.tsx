import React from 'react';
import { SiteVersion } from '@common/constants';
import Button from '@components/base/Button/Button';
import Input from '@components/base/Input/Input';
import Checkbox from '@components/base/Input/Checkbox';
import { UserWithPassword } from 'typings/user';
import { FormattedMessage } from 'react-intl';
import { objectFitPolyfill } from '@common/../client/polyfill/object-fit';
import FullScreenLoader from '@components/base/FullScreenLoader';
import PasswordInput from '@components/base/Input/PasswordInput';
import { Link } from 'react-router-dom';
import IconButton from '@components/base/Button/IconButton';
import { isEmailValid } from '@components/layout/Footer/EmailCapture';
import { UserRootState } from '@common/rematch/models/user';
import AccountLayout from '@containers/Account/AccountLayout';
import { Desktop } from '@components/base/MediaQuerySSR';

const SignupImage = require('@common/assets/jpg/signup.jpg');
const FacebookIcon = require('@svg/i-facebook.svg').default;

interface Props {
    user: UserRootState;
    siteVersion: SiteVersion;

    login: (user: UserWithPassword) => void;
}

interface State {
    email: string;
    password: string;
    rememberMe: boolean;
    error: boolean;
    submitting: boolean;
}

class Login extends React.PureComponent<Props, State> {

    public state: State = {
        email: '',
        password: '',
        rememberMe: false,
        error: false,
        submitting: false,
    };

    public componentDidMount() {
        objectFitPolyfill();

        if (this.props.user && !this.props.user.error) {
            window.location.href = '/';
        }
    }

    public componentDidUpdate(prevProps: Props) {
        // Redirect if the user has successfully logged in
        if (this.props.user && !this.props.user.error) {
            window.location.href = '/';
        }

        if (this.props.user && this.props.user.error && !prevProps.user) {
            this.setState({ error: true, submitting: false });
        }
    }

    private submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isEmailValid(this.state.email)) {
            this.setState({ submitting: true, error: false });
            this.login();
        } else {
            this.setState({ error: true, submitting: false });
        }
    }

    private login() {
        const { email, password, rememberMe } = this.state;
        const { login } = this.props;

        const user: Partial<UserWithPassword> = {
            email,
            password,
            rememberMe,
        };

        login(user as UserWithPassword);
    }

    public render() {
        if (this.props.user && !this.props.user.error) {
            return <FullScreenLoader />;
        }

        return (
            <AccountLayout
                messageContent={
                    <Desktop>
                        <React.Fragment>
                            <h3><FormattedMessage id={'Account.Login.Message'} defaultMessage={'When you join Fame & Partners, you are joining a movement. Thank you for saying no to mass produced wasteful clothing.'} /></h3>
                        </React.Fragment>
                    </Desktop>
                }
                imageContent={<img src={SignupImage} data-object-fit="cover" />}
                formContent={
                    <React.Fragment>
                        <div className={'form-header'}>
                            <h2><FormattedMessage id={'Account.Login.Title'} defaultMessage={'Login'} /></h2>
                            <p>
                                <FormattedMessage 
                                    id={'Account.Login.NoAccount'} 
                                    defaultMessage={'Don\'t have an account yet? {createLink}'} 
                                    values={{
                                        createLink: <Link to="/account/signup">Create a new account</Link>
                                    }}
                                />
                            </p>
                            {this.state.error && <p className={'error'}><FormattedMessage id={'Account.Login.ErrorMessage'} defaultMessage={'Your email and/or password is incorrect'} /></p>}
                        </div>
                        <form 
                            onSubmit={(e) => this.submit(e)} 
                            noValidate
                        >
                            <Input 
                                name={'email'}
                                type={'email'}
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                placeholder={'Email'}
                            />
                            <PasswordInput
                                name={'password'}
                                value={this.state.password}
                                onChange={(v) => this.setState({ password: v })}
                                placeholder={'Password'}
                            />
                            
                            <p>
                                <FormattedMessage 
                                    id={'Account.Login.ForgotPassword'} 
                                    defaultMessage={'{link}'}
                                    values={{
                                        link: <Link to="/account/forgot-password">Forgot Password?</Link>
                                    }}
                                />
                            </p>

                            <Checkbox label={'Remember me'} name={'rememberMe'} checked={this.state.rememberMe} onChange={() => this.setState({ rememberMe: !this.state.rememberMe })} />
                            <Button spinner={this.state.submitting} fullwidth><FormattedMessage id={'Account.Login.Button'} defaultMessage={'Login'} /></Button>
                        </form>
                        
                        <div className={'seperator'}><FormattedMessage id={'Account.Seperator'} defaultMessage={'OR'} /></div>

                        <IconButton
                            icon={<FacebookIcon />}
                            facebook
                            white
                            fullwidth 
                            rel="nofollow"
                            url={`${global.__FAME_CONFIG__.URLS[this.props.siteVersion].api}/fb_auth?return_to=${encodeURI(global.__FAME_CONFIG__.URLS[this.props.siteVersion].frontend)}`}
                        >
                            <FormattedMessage id={'Account.Facebook'} defaultMessage={'SIGN IN WITH FACEBOOK'} />
                        </IconButton>
                    </React.Fragment>
                }
            />
        );
    }
}

export default Login;
