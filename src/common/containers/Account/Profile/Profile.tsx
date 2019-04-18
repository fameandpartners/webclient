import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@components/base/Button/Button';
import Input from '@components/base/Input/Input';
import PasswordInput from '@components/base/Input/PasswordInput';
import { UserRootState } from '@common/rematch/models/user';
import BaseLayout from '@containers/BaseLayout';
import { isEmailValid } from '@components/layout/Footer/EmailCapture';

export interface UserProfileRequest {
    profile: {
        first_name: string;
        last_name: string;
        old_password: string;
        password: string;
        password_confirmation: string;
        email: string;
        old_email: string;
    };
}

interface Props {
    user: UserRootState;

    updateProfile: (profile: UserProfileRequest) => void;
}

interface State {
    oldEmail: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    firstName: string;
    lastName: string;
    error: boolean;
    submitting: boolean;
    updated: boolean;
}

class Profile extends React.PureComponent<Props, State> {
    public state: State = {
        oldEmail: this.props.user ? this.props.user.email : '',
        email: this.props.user ? this.props.user.email : '',
        oldPassword: '',
        newPassword: '',
        firstName: this.props.user ? this.props.user.firstName : '',
        lastName: this.props.user ? this.props.user.lastName : '',
        error: false,
        submitting: false,
        updated: false,
    };

    public componentDidMount() {
        if (!this.props.user) {
            window.location.href = '/account/login';
        }
    }

    public componentDidUpdate(prevProps: Props) {

        if (this.props.user && !this.props.user.error && this.props.user.updated && this.state.submitting) {
            this.setState({ submitting: false, updated: true });
        }
    }

    private isValidProfile() {
        let isValid = true;

        if (!isEmailValid(this.state.email)) {
            isValid = false;
        }

        if (!this.state.firstName) {
            isValid = false;
        }

        if (!this.state.lastName) {
            isValid = false;
        }

        return isValid;
    }

    private submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validate
        if (this.isValidProfile()) {
            this.props.updateProfile({
                profile: {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    email: this.state.email,
                    old_email: this.state.oldEmail,
                    old_password: this.state.oldPassword,
                    password: this.state.newPassword,
                    password_confirmation: this.state.newPassword,
                }
            });
            this.setState({ error: false, submitting: true, updated: false });
        } else {
            this.setState({ error: true, submitting: false, updated: false });
        }
    }

    public render() {
        return (
            <BaseLayout>
                <style jsx>{`
                    @import 'vars';

                    .AccountProfile {

                        @include mobile {
                            margin-top: space(4);
                        }

                        @include desktop {
                            min-height: inherit;
                            display: flex;
                            align-items: center;
                        }

                        .Grid {
                            @include grid;
                        }

                        .Column {
                            @include grid-column(12);

                            @include desktop {
                                @include grid-offset-margin-left(4);
                                @include grid-column(4);
                                @include grid-offset-margin-right(4);
                            }
                        }

                        :global(input) {
                            margin-bottom: 2*$space-base;
                        }

                        :global(.Checkbox) {
                            margin-bottom: 2*$space-base;
                        }

                        :global(.form-header) {
                            text-align: center;
                        }

                        :global(.error) {
                            color: $color-red;
                            border: 1px solid $color-red;
                            padding: $space-base;
                        }

                        :global(.success) {
                            border: 1px solid $color-grey60;
                            padding: $space-base;
                        }

                    }

                    h1 {
                        text-align: center;
                        margin: space(10) 0 0;

                        @include mobile {
                            margin: space(5) 0 0;
                        }
                    }
                `}</style>
                <h1><FormattedMessage id={'Account.Profile.Title'} defaultMessage={'My Account'} /></h1>
                <div className={'AccountProfile'}>
                    <div className={'Grid'}>
                        <div className={'Column'}>
                            <div className={'form-header'}>
                                {this.state.error && <p className={'error'}><FormattedMessage id={'Account.Profile.ErrorMessage'} defaultMessage={'Check that your passwords are matching'} /></p>}
                                {this.state.updated && <p className={'success'}><FormattedMessage id={'Account.Profile.SuccessMessage'} defaultMessage={'Your profile has been updated!'} /></p>}
                            </div>
                            <form
                                onSubmit={(e) => this.submit(e)}
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
                                    value={this.state.oldPassword}
                                    onChange={(v) => this.setState({ oldPassword: v })}
                                    placeholder={'Old Password'}
                                />
                                <PasswordInput
                                    name={'password'}
                                    value={this.state.newPassword}
                                    onChange={(v) => this.setState({ newPassword: v })}
                                    placeholder={'New Password'}
                                />

                                <Button spinner={this.state.submitting} fullwidth><FormattedMessage id={'Account.Profile.Button'} defaultMessage={'UPDATE'} /></Button>
                            </form>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        );
    }
}

export default Profile;
