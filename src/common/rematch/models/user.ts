import { User, UserWithPassword } from '@typings';
import { createModel, RematchRootState } from '@rematch/core';
import FameAPI from '@common/services/fameApi';
import { UserProfileRequest } from '@containers/Account/Profile/Profile';

export type UserRootState = User & { forgotPasswordEmailSent?: boolean, passwordChanged?: boolean, updated?: boolean, error?: boolean } | null;

const DEFAULT_STATE: UserRootState = null;

const UserModel = createModel({
    reducers: {
        update(state: UserRootState, user: User): UserRootState {
            return user;
        },
    },
    effects: {
        async signup(payload: UserWithPassword, rootState: RematchRootState<any>) {
            try {
                // Reset state in case of errors
                this.update(DEFAULT_STATE);

                const fameApi = new FameAPI(rootState.SiteVersion);
                const user = await fameApi.signup(payload);
                this.update(user);
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        },
        async login(payload: UserWithPassword, rootState: RematchRootState<any>) {
            try {
                // Reset state in case of errors
                this.update(DEFAULT_STATE);

                const fameApi = new FameAPI(rootState.SiteVersion);
                const user = await fameApi.login(payload);
                this.update(user);
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        },
        async logout(payload: any, rootState: RematchRootState<any>) {
            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                await fameApi.logout();
                this.update(DEFAULT_STATE);
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        },
        async resetPassword(payload: { token: string, password: string }, rootState: RematchRootState<any>) {
            try {
                if (rootState.UserModel) {
                    const cleanUser = {
                        ...rootState.UserModel,
                        passwordChanged: false
                    };
                    this.update(cleanUser);
                }

                const fameApi = new FameAPI(rootState.SiteVersion);
                const user = await fameApi.resetPassword(payload.token, payload.password);
                const updatedUser = {
                    ...user,
                    passwordChanged: true,
                    error: false,
                };

                this.update(updatedUser);
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        },
        async sendResetPasswordEmail(payload: string, rootState: RematchRootState<any>) {
            try {
                if (rootState.UserModel) {
                    const cleanUser = {
                        ...rootState.UserModel,
                        forgotPasswordEmailSent: false,
                        error: false,
                    };
                    this.update(cleanUser);
                }

                const fameApi = new FameAPI(rootState.SiteVersion);
                await fameApi.sendResetPasswordEmail(payload);
                this.update({ forgotPasswordEmailSent: true });
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        },
        async updateProfile(payload: UserProfileRequest, rootState: RematchRootState<any>) {
            try {
                if (rootState.UserModel) {
                    const cleanUser = {
                        ...rootState.UserModel,
                        updated: false,
                        error: false,
                    };
                    this.update(cleanUser);
                }

                const fameApi = new FameAPI(rootState.SiteVersion);
                const user = await fameApi.updateProfile(payload);
                const updatedUser = {
                    ...user,
                    updated: true,
                    error: false,
                };

                this.update(updatedUser);
            } catch (e) {
                console.error(e);
                this.update({ error: true });
            }
        }
    },
    state: DEFAULT_STATE,
});

export default UserModel;
