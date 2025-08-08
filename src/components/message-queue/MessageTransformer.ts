import { MessagePayload } from './MessageHandler';

export interface TransformedMessage {
    eventId: string;
    eventType: string;
    eventTimestamp: string;
    userData: {
        action: string;
        userId: string;
    };
}

export class MessageTransformer {
    transform(payload: MessagePayload): TransformedMessage {
        return {
            eventId: payload.id,
            eventType: payload.data.type,
            eventTimestamp: payload.timestamp,
            userData: payload.data.details
        };
    }
}
