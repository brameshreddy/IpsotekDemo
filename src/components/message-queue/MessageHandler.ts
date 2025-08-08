import { MessageTransformer } from './MessageTransformer';

export interface MessagePayload {
    id: string;
    timestamp: string;
    data: {
        type: string;
        details: {
            action: string;
            userId: string;
        };
    };
}

export class MessageHandler {
    constructor(
        private readonly apiClient: any,
        private readonly apiPath: string,
        private readonly transformer: MessageTransformer
    ) { }

    async handleMessage(message: string): Promise<void> {
        try {
            const payload = JSON.parse(message) as MessagePayload;
            const transformedData = this.transformer.transform(payload);
            await this.apiClient.post(this.apiPath, transformedData);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
}
