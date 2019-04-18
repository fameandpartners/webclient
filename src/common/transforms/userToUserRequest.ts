import { UserRequest, UserWithPassword } from 'typings';

export default function transform(user: UserWithPassword): UserRequest {
    return {
        spree_user: {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            password: user.password,
            password_confirmation: user.password,
        }
    };
}
