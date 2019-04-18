import { User } from '@typings';
import { SpreeUser } from 'typings/fame_api/user';

export default function transform(userResponse?: SpreeUser | false): User | null {
    if (!userResponse) {
        return null;
    }

    return {
        id: userResponse.id,
        email: userResponse.email,
        firstName: userResponse.first_name,
        lastName: userResponse.last_name,
        isAdmin: userResponse.is_admin,
        currentSignInDate: userResponse.current_sign_in_at,
        lastSignInDate: userResponse.last_sign_in_at,
    };
}
