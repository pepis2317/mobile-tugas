export type Message = {
    id: string;
    chatId: string;
    sender: {
        id: string;
        name: string;
    };
    messageText: string;
    createdAt: string;
};
