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