import React from 'react';
import { SiteVersion } from '@common/constants';
import { UserWithPassword } from 'typings/user';
import Input from '@components/base/Input/Input';
import Button from '@components/base/Button/Button';
import { objectFitPolyfill } from '@common/../client/polyfill/object-fit';
import FullScreenLoader from '@components/base/FullScreenLoader';
import PasswordInput from '@components/base/Input/PasswordInput';
import { FormattedMessage } from 'react-intl';
import IconButton from '@components/base/Button/IconButton';
import { isEmailValid } from '@components/layout/Footer/EmailCapture';
import AccountLayout from '@containers/Account/AccountLayout';
import { UserRootState } from '@common/rematch/models/user';
import { Link } from 'react-router-dom';

const SignupImage = require('@common/assets/jpg/signup.jpg');
const FacebookIcon = require('@svg/i-facebook.svg').default;

interface Props {
    user: UserRootState;
    siteVersion: SiteVersion;

    signup: (user: UserWithPassword) => void;
}

interface State {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    error: boolean;
    submitting: boolean;
}

class Signup extends React.PureComponent<Props, State> {
    public state: State = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
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
            this.signup();
        } else {
            this.setState({ error: true, submitting: false });
        }
    }

    private signup() {
        const { email, password, firstName, lastName } = this.state;
        const { signup } = this.props;

        const user: Partial<UserWithPassword> = {
            email,
            password,
            firstName,
            lastName,
        };

        signup(user as UserWithPassword);
    }

    public render() {
        if (this.props.user && !this.props.user.error) {
            return <FullScreenLoader />;
        }

        return (
            <AccountLayout
                messageContent={
                    <React.Fragment>
                        <h3><FormattedMessage id={'Account.Signup.Message'} defaultMessage={'When you join Fame & Partners, you are joining a movement. Thank you for saying no to mass produced wasteful clothing.'} /></h3>
                        <h3><FormattedMessage id={'Account.Signup.Message2'} defaultMessage={'Have your clothing made to order with $20 off to try it for the first time.'} /></h3>

                        {/* <p className={'footnote'}><sub><FormattedMessage id={'Account.Signup.Footnote'} defaultMessage={'*$50 including $25 worth of free returns insurance and $25 off your order.'} /></sub></p> */}
                    </React.Fragment>
                }
                imageContent={<img src={SignupImage} data-object-fit="cover" />}
                formContent={
                    <React.Fragment>
                        <div className={'form-header'}>
                            <h2><FormattedMessage id={'Account.Signup.Title'} defaultMessage={'Join'} /></h2>
                            <p>
                                <FormattedMessage 
                                    id={'Account.Signup.ExistingAccount'} 
                                    defaultMessage={'Already have an account? {createLink}'} 
                                    values={{
                                        createLink: <Link to="/account/login">Sign in here</Link>
                                    }}
                                />
                            </p>
                            {this.state.error && <p className={'error'}><FormattedMessage id={'Account.Signup.ErrorMessage'} defaultMessage={'Check that you\'ve filled in all fields and your email is correct'} /></p>}
                        </div>
                        <form 
                            onSubmit={(e) => this.submit(e)} 
                            noValidate
                        >
                            <Input 
                                name={'firstName'}
                                type={'text'}
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                                placeholder={'First Name'}
                            />
                            <Input 
                                name={'lastName'}
                                type={'text'}
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                                placeholder={'Last Name'}
                            />
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

                            <Button spinner={this.state.submitting} fullwidth><FormattedMessage id={'Account.Signup.Button'} defaultMessage={'JOIN'} /></Button>
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
                            <FormattedMessage id={'Account.Facebook'} defaultMessage={'SIGN UP WITH FACEBOOK'} />
                        </IconButton>
                    </React.Fragment>
                }
            />
        );
    }

}

export default Signup;
