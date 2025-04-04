import {chat, message} from "@/lib/types";

export const fetchChats = async (): Promise<chat[]> => {
    try {
        const response = await fetch(`https://localhost:7111/chats`);

        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error; // Oder handle den Fehler je nach Bedarf
    }
}

export const fetchChat = async (id: string): Promise<chat> => {
    const data = await fetch(`https://localhost:7111/chats/${id}`, {
        method: 'GET', // oder 'POST', je nachdem
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!data.ok) {
        throw new Error(`Error fetching chat: ${data.statusText}`);
    }

    return await data.json();
}

export const postMessage = async (message: message): Promise<message> => {
    try {
        const response = await fetch(`https://localhost:7111/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message.content,
                fromUser: message.fromUser,
                chatId: message.chatId // Nicht in einem verschachtelten "sendMessage"
            }),
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Senden der Nachricht: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
        throw error;
    }
};

export const postChat = async (name: string): Promise<chat> => {
    const response = await fetch(`https://localhost:7111/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
        })
    })

    if (!response.ok) {
        throw new Error(`Fehler beim Senden der Nachricht: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const deleteChatFetch = async (id: string): Promise<chat> => {
    const response = await fetch(`https://localhost:7111/chats/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (!response.ok) {
        throw new Error("Fehler beim Löschen eines Chats");
    }
    return await response.json();
}

export const renameChatFetch = async (id: string, newName: string): Promise<chat> => {
    const response = await fetch(`https://localhost:7111/chats/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: newName,
        })
    })

    if (!response.ok) {
        throw new Error("Fehler beim Umbenennen eines Chats");
    }

    return await response.json();
}
