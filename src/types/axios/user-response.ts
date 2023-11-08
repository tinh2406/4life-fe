export interface UserResponse {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    dateOfBirth: string | null;
    gender: boolean | null;
    description: string;
    frontIdentityCard: string;
    backIdentityCard: string;
    statusModRole: string;
}