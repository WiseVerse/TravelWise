export type chat = {
    id: string;
    name: string;
    created: string;
    messages?: message[];
}

export type message = {
    id: string;
    content: string;
    fromUser: boolean;
    chatId: string;
}

export type AuthResponse = {
    token: string
}

export type ErrorRegisterResponse = {
    errors: [
        {
            code: string,
            description: string
        }
    ]
}

export type ErrorLoginResponse = {
    message: string
}

export type User = {
    email: string;
    userName: string;
}