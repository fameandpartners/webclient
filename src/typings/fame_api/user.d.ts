export type SpreeUser = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    is_admin: boolean,
    current_sign_in_at?: string,
    last_sign_in_at?: string,
}