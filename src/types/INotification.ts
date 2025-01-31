import { MessageType } from ".";

export default interface INotification {
    id: string;
    message: string;
    type: MessageType;
    duration?: number;
    tag?: string;
}