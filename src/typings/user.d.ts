export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    isAdmin: boolean,
    currentSignInDate?: string,
    lastSignInDate?: string,
}

export type UserRequest = {
    spree_user: {
        email: string,
        first_name?: string,
        last_name?: string,
        password_confirmation: string,
        password: string,
        sign_up_reason?: string,
    }
}

export type UserWithPassword = User & { password: string, rememberMe?: boolean };
